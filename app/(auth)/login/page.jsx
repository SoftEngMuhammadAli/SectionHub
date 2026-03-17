import { AuthShell } from "@/components/shared/layout/auth-shell";
import { LoginForm } from "@/components/sectionhub/forms/login-form";
export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
