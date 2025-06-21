import { AuthLayout } from "@/components/auth/auth-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "@/hooks/use-translations"

export default function ResetPasswordLoading() {
  const t = useTranslations()

  return (
    <AuthLayout 
      title={t("auth.reset_password")} 
      subtitle={t("auth.reset_instructions")}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md mx-auto" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-8 w-40 rounded-md" />
        </div>
      </div>
    </AuthLayout>
  )
}
