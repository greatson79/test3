'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/reservation/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { reservationService } from '@/lib/services/reservation';
import { useState, Suspense } from 'react';
import { toast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Info, Calendar, Clock, User } from 'lucide-react';

const formSchema = z.object({
    guest_name: z.string().min(2, { message: "이름은 2글자 이상이어야 합니다." }),
    guest_phone: z.string().regex(/^010\d{8}$/, { message: "올바른 휴대폰 번호 형식이 아닙니다. (예: 01012345678)" }),
    guest_password: z.string().length(4, { message: "비밀번호는 4자리 숫자여야 합니다." }).regex(/^\d+$/, { message: "숫자만 입력 가능합니다." }),
});

function ReservationFormContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const categoryId = searchParams.get('categoryId');
    const categoryName = searchParams.get('categoryName');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            guest_name: '',
            guest_phone: '',
            guest_password: '',
        },
    });

    if (!date || !time || !categoryId) {
        if (typeof window !== 'undefined') router.push('/');
        return null;
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await reservationService.createReservation({
                category_id: parseInt(categoryId as string),
                visit_date: date as string,
                visit_time: parseInt(time as string),
                guest_name: values.guest_name,
                guest_phone: values.guest_phone,
                guest_password: values.guest_password,
            });
            setShowSuccessDialog(true);
        } catch (error: any) {
            toast({
                title: "예약 실패",
                description: error.message || "알 수 없는 에러가 발생했습니다.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <div className="container max-w-2xl mx-auto py-10 px-4">
                <Card className="shadow-xl border-none">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">심방 예약 신청</CardTitle>
                        <CardDescription>선택하신 일정을 확인하고 예약 정보를 입력해 주세요.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full text-primary">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">심방 종류</p>
                                    <p className="font-semibold">{categoryName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full text-primary">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">예약 일자</p>
                                    <p className="font-semibold">{date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full text-primary">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">예약 시간</p>
                                    <p className="font-semibold">{time}:00</p>
                                </div>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="guest_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>예약자명</FormLabel>
                                            <FormControl>
                                                <Input placeholder="이름을 입력해 주세요" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guest_phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>휴대폰 번호</FormLabel>
                                            <FormControl>
                                                <Input placeholder="01012345678 (숫자만 입력)" {...field} />
                                            </FormControl>
                                            <FormDescription>조회 시 필요하니 정확히 입력해 주세요.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guest_password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>비밀번호 (4자리)</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="숫자 4자리" maxLength={4} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900 flex gap-3 text-amber-800 dark:text-amber-300">
                                    <Info className="h-5 w-5 shrink-0" />
                                    <p className="text-sm">
                                        예약 후 일정 변경이나 취소는 예약조회 페이지에서 진행하실 수 있습니다. (구현 예정)
                                    </p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button variant="outline" type="button" className="flex-1" onClick={() => router.back()}>뒤로가기</Button>
                                    <Button type="submit" className="flex-[2]" disabled={isSubmitting}>
                                        {isSubmitting ? "처리 중..." : "예약 제출하기"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showSuccessDialog} onOpenChange={(open) => !open && router.push('/')}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>예약 완료</DialogTitle>
                        <DialogDescription>
                            심방 예약이 정상적으로 접수되었습니다.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-6">
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <Check className="h-10 w-10" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => router.push('/')} className="w-full">확인</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function ReservationFormPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
                <ReservationFormContent />
            </Suspense>
        </div>
    );
}

function Check(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
