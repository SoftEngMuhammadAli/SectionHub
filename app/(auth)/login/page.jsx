import { AuthShell } from "@/components/sectionhub/layout";
import { LoginForm } from "@/components/sectionhub/forms/login-form";
export default function LoginPage() {
    return (<AuthShell title="Login" subtitle="Sign in to access the internal admin workspace.">
      <LoginForm />
    </AuthShell>);
}
