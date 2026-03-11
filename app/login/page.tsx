import { SignIn } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 mb-8">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <Sparkles size={28} className="text-purple-400" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white">AuraForms</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-400">Welcome back</h2>
      </div>

      <div className="relative z-10">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 transition-all text-sm font-semibold',
              card: 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'bg-white/5 border-white/10 hover:bg-white/10 text-white',
              socialButtonsBlockButtonText: 'text-white font-medium',
              dividerLine: 'bg-white/10',
              dividerText: 'text-gray-500',
              formFieldLabel: 'text-gray-300',
              formFieldInput: 'bg-white/5 border-white/10 text-white focus:ring-purple-500',
              footerActionText: 'text-gray-500',
              footerActionLink: 'text-purple-400 hover:text-purple-300',
              identityPreviewText: 'text-white',
              identityPreviewEditButtonIcon: 'text-purple-400',
            }
          }}
          routing="path"
          path="/login"
          signUpUrl="/signup"
        />
      </div>
    </div>
  );
}
