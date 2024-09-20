import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-lg font-bold mb-3">Task Master</div>

          <div className="flex flex-col md:flex-row items-center gap-x-5 gap-y-3 justify-center">
            <Link href="/about" className="hover:text-blue-400">
              About
            </Link>
            <Link href="/features" className="hover:text-blue-400">
              Features
            </Link>
            <Link href="/support" className="hover:text-blue-400">
              Support
            </Link>
            <Link href="/privacy" className="hover:text-blue-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-400">
              Terms of Service
            </Link>
          </div>

          <div className="flex justify-center">
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              className="hover:text-blue-400"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="hover:text-blue-400"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="hover:text-blue-400"
            >
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>

        <div className="text-center text-sm mt-6">
          <p>
            &copy; {new Date().getFullYear()} Task Master. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
