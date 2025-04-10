'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useActionState } from 'react';
import { createUser } from "@/lib/actions/createUser";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(createUser, {
    success: false,
    errors: {},
  });
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ユーザ新規登録</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="名前"
              required
            />
            {state.errors.name && state.errors.name.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">{error}</p>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="メールアドレス"
              required
            />
            {state.errors.email && state.errors.email.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">{error}</p>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="パスワード"
              required
            />
            {state.errors.password && state.errors.password.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">{error}</p>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">パスワード(確認)</Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="パスワード"
              required
            />
            {state.errors.confirmPassword && state.errors.confirmPassword.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">{error}</p>
            ))}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "登録中..." : "登録"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}