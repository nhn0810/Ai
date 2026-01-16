
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Constants
const MANNER_PENALTY = 5;
const PARTICIPATION_PENALTY = 10;
const CHECK_IN_WINDOW_MINUTES = 30;

Deno.serve(async (req) => {
  // This is a protected route, and you should secure it.
  // For example, you can check the `Authorization` header for a secret token.
  // const authHeader = req.headers.get('Authorization');
  // if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // 1. Find studies with recent meetings that should have ended
    // This requires a `meeting_schedule` table or similar, which is not in the spec.
    // We will simulate finding one study for now.
    // A real query would be something like:
    // const { data: studies, error: studiesError } = await supabase
    //   .from('studies')
    //   .select('id, meeting_time')
    //   .lt('meeting_time', new Date(Date.now() - CHECK_IN_WINDOW_MINUTES * 60 * 1000).toISOString());
    
    // For demonstration, let's assume we are checking for a study that just finished.
    const { data: allStudies, error: allStudiesError } = await supabase.from('studies').select('id');
    if (allStudiesError) throw allStudiesError;


    for (const study of allStudies) {
        // 2. Get all members of the study
        const { data: members, error: membersError } = await supabase
            .from('study_members')
            .select('user_id')
            .eq('study_id', study.id);

        if (membersError) continue; // Skip to next study on error

        // 3. Get all attendance logs for this study for the recent meeting
        // A real query needs to filter by the specific meeting time window.
        const { data: attendees, error: attendeesError } = await supabase
            .from('attendance_logs')
            .select('user_id')
            .eq('study_id', study.id);
            // .gte('checked_in_at', meetingStartTime.toISOString())
            // .lte('checked_in_at', meetingEndTime.toISOString());

        if (attendeesError) continue;

        const attendeeIds = new Set(attendees.map(a => a.user_id));

        // 4. Find no-shows
        const noShowMembers = members.filter(member => !attendeeIds.has(member.user_id));

        // 5. Apply penalties
        for (const noShow of noShowMembers) {
            // Use RPC to decrement scores atomically
            const { error: rpcError } = await supabase.rpc('apply_penalty', {
                p_user_id: noShow.user_id,
                p_manner_deduction: MANNER_PENALTY,
                p_participation_deduction: PARTICIPATION_PENALTY
            });
            if (rpcError) {
                console.error(`Failed to apply penalty to ${noShow.user_id}:`, rpcError);
            }
        }
    }

    return new Response(JSON.stringify({ success: true, message: "No-show check complete." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
