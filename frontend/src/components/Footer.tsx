import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">

          <div className="text-lg font-bold">
          Task Master
          </div>

          <div className="flex space-x-6">
            <a href="/about" className="hover:text-blue-400">
              About
            </a>
            <a href="/features" className="hover:text-blue-400">
              Features
            </a>
            <a href="/support" className="hover:text-blue-400">
              Support
            </a>
            <a href="/privacy" className="hover:text-blue-400">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-blue-400">
              Terms of Service
            </a>
          </div>

          <div className="flex space-x-4">
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
            &copy; {new Date().getFullYear()} Task Master. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
