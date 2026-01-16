import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import StudyList from "./StudyList";
import PageHeader from "@/components/layout/PageHeader";

async function getStudies() {
  const supabase = await createClient();
  
  // Fetch all studies
  const { data: studies } = await supabase
    .from('studies')
    .select(`
        *,
        members:study_members(count)
    `)
    .order('created_at', { ascending: false });

  // Transform data to include member count directly
  const formattedStudies = studies?.map(study => ({
    ...study,
    member_count: study.members?.[0]?.count || 0
  })) || [];

  return formattedStudies;
}

async function getMyStudyIds() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: myMemberships } = await supabase
        .from('study_members')
        .select('study_id')
        .eq('user_id', user.id);
    
    return myMemberships?.map(m => m.study_id) || [];
}

export default async function StudyListPage() {
  const studies = await getStudies();
  const myStudyIds = await getMyStudyIds();

  return (
    <>
      <PageHeader title="스터디" />
      <StudyList initialStudies={studies} myStudyIds={myStudyIds} />
    </>
  );
}
