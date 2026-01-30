'use client';

import { useState } from 'react';
import { Header } from '@/components/reservation/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { reservationService } from '@/lib/services/reservation';
import { Reservation, VisitCategory } from '@/types/reservation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Search, Calendar, Phone, User, Inbox } from 'lucide-react';

const searchSchema = z.object({
    guest_phone: z.string().regex(/^010\d{8}$/, { message: "올바른 휴대폰 번호 형식이 아닙니다." }),
    guest_password: z.string().length(4, { message: "비밀번호는 4자리 숫자입니다." }),
});

export default function SearchPage() {
    const [results, setResults] = useState<(Reservation & { visit_categories: VisitCategory })[] | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            guest_phone: '',
            guest_password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof searchSchema>) {
        setIsSearching(true);
        try {
            const data = await reservationService.searchReservations(values.guest_phone, values.guest_password);
            setResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <Header />
            <main className="container max-w-4xl mx-auto py-10 px-4">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">예약 내역 조회</h1>
                    <p className="text-muted-foreground mt-2">입력하신 정보를 바탕으로 예약 내역을 확인합니다.</p>
                </div>

                <div className="grid gap-8">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">조회 정보 입력</CardTitle>
                            <CardDescription>휴대폰 번호와 비밀번호를 입력해 주세요.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-end">
                                    <FormField
                                        control={form.control}
                                        name="guest_phone"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>휴대폰 번호</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="01012345678" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guest_password"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>비밀번호 (4자리)</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="****" maxLength={4} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full md:w-32" disabled={isSearching}>
                                        {isSearching ? "조회 중..." : (
                                            <>
                                                <Search className="h-4 w-4 mr-2" />
                                                조회하기
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {results !== null && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                조회 결과 <span className="text-sm font-normal text-muted-foreground">({results.length}건)</span>
                            </h2>

                            {results.length > 0 ? (
                                <div className="grid gap-4">
                                    {results.map((res) => (
                                        <Card key={res.id} className="border-l-4 border-l-primary overflow-hidden transition-all hover:shadow-md">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col md:flex-row">
                                                    <div className="bg-primary/5 p-6 flex flex-col justify-center items-center min-w-[200px] border-r">
                                                        <span className="text-primary font-bold text-lg">{res.visit_categories.name}</span>
                                                        <span className="text-muted-foreground text-sm mt-1">예약 확정</span>
                                                    </div>
                                                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-muted-foreground">일시</span>
                                                                <span className="font-medium text-sm">
                                                                    {format(new Date(res.visit_date), 'yyyy년 MM월 dd일', { locale: ko })} {res.visit_time}:00
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-muted-foreground">예약자명</span>
                                                                <span className="font-medium text-sm">{res.guest_name}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-muted-foreground">연락처</span>
                                                                <span className="font-medium text-sm">{res.guest_phone}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-dashed text-center">
                                    <div className="bg-muted p-4 rounded-full mb-4">
                                        <Inbox className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium">조회된 예약 내역이 없습니다.</p>
                                    <p className="text-sm text-muted-foreground mt-1">입력하신 정보가 올바른지 확인해 주세요.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
