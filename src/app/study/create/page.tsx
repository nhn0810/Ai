"use client";

import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Textarea } from "@/components/ui/Textarea";

export default function CreateStudyPage() {
  return (
    <>
      <PageHeader title="새 스터디 만들기" />
      <div className="pt-20 p-4">
        <form className="space-y-6">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">스터디 이름</Label>
            <Input type="text" id="title" placeholder="예: Next.js 14 마스터하기" />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">스터디 설명</Label>
            <Textarea id="description" placeholder="스터디 목표, 진행 방식 등을 자세히 적어주세요." />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="location">주요 활동 지역</Label>
            <Input type="text" id="location" placeholder="예: 강남역, 온라인" />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label>참여 방식</Label>
            <RadioGroup defaultValue="open" className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="open" id="open" />
                <Label htmlFor="open" className="font-normal">오픈 (누구나 참여)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approval" id="approval" />
                <Label htmlFor="approval" className="font-normal">승인제 (리더 승인 필요)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button type="submit" className="w-full" size="lg">
            스터디 생성하기
          </Button>
        </form>
      </div>
    </>
  );
}
