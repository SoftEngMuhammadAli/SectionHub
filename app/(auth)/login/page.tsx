import { AuthShell } from "@/components/sectionhub/layout";
import { LoginScreen } from "@/components/sectionhub/auth-screens";

export default function LoginPage() {
  return <AuthShell title="Login" subtitle="Sign in to access the internal admin workspace."><LoginScreen /></AuthShell>;
}
