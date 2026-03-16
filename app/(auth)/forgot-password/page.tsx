import { AuthShell } from "@/components/sectionhub/layout";
import { ForgotPasswordScreen } from "@/components/sectionhub/auth-screens";

export default function ForgotPasswordPage() {
  return <AuthShell title="Forgot Password" subtitle="Recover admin access with a time-limited reset link."><ForgotPasswordScreen /></AuthShell>;
}
