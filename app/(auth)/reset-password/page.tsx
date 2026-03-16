import { AuthShell } from "@/components/sectionhub/layout";
import { ResetPasswordScreen } from "@/components/sectionhub/auth-screens";

export default function ResetPasswordPage() {
  return <AuthShell title="Reset Password" subtitle="Choose a strong password and restore access securely."><ResetPasswordScreen /></AuthShell>;
}
