import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 text-center">
          Welcome to Atomic Sensei
        </h1>

        <p className="text-gray-600 mb-8 text-center">
          Your AI-powered learning assistant that helps you master complex topics
          through personalized learning paths.
        </p>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center"
          >
            Log In
          </Link>

          <Link
            href="/register"
            className="block w-full bg-white hover:bg-gray-50 text-blue-600 font-medium py-3 px-4 rounded-lg text-center border border-blue-200"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
