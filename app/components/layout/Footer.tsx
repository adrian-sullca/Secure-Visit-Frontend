// import HamburgerMenu from "../utils/HamburgerMenu";

export default function Footer() {
  return (
    <footer className="bg-white border-t py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center">
            © 2024 Secure Visit. Todos los derechos reservados.
          </p>
          <div className="flex flex-col space-y-2 xs:space-y-0 xs:flex-row xs:space-x-6 mt-4 md:mt-0">
            <div className="text-gray-500 hover:text-gray-900 text-sm cursor-pointer">
              Privacidad
            </div>
            <div className="text-gray-500 hover:text-gray-900 text-sm cursor-pointer">
              Términos
            </div>
            <div className="text-gray-500 hover:text-gray-900 text-sm cursor-pointer">
              Contacto
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
