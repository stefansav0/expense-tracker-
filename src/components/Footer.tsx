import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full p-4 bg-gray-100 text-center text-sm text-gray-600 mt-10 border-t">
      <div className="space-x-4">
        <Link href="/terms-of-service" className="hover:underline">
          Terms of Service
        </Link>
        <Link href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="/cookie-settings" className="hover:underline">
          Cookie Settings
        </Link>
      </div>
      <p className="mt-2">&copy; {new Date().getFullYear()} Expense Tracker</p>
    </footer>
  );
}
