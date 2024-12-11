
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const settingsSchema = z.object({
  username: z.string().min(2).max(30),
  targetDays: z.string().regex(/^\d+$/, "数字を入力してください"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function Settings() {
  const { toast } = useToast();
  const { user, updateUser, deleteAccount } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: user?.username || "",
      targetDays: user?.targetDays?.toString() || "",
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setIsLoading(true);
      const result = await updateUser({
        username: data.username,
        targetDays: parseInt(data.targetDays),
      });
      if (!result.ok) {
        toast({
          variant: "destructive",
          title: "エラー",
          description: result.message,
        });
        return;
      }
      toast({
        title: "成功",
        description: "設定を更新しました",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "設定の更新に失敗しました",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      const result = await deleteAccount();
      if (!result.ok) {
        toast({
          variant: "destructive",
          title: "エラー",
          description: result.message,
        });
        return;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "アカウントの削除に失敗しました",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">設定</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザー名</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目標禁欲日数</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "更新中..." : "更新"}
            </Button>
          </form>
        </Form>
      </div>

      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold text-destructive mb-4">危険な操作</h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">アカウントを削除</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>本当にアカウントを削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消すことができません。すべてのデータが完全に削除されます。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground"
              >
                削除する
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
