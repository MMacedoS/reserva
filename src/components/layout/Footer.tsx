const Footer = () => {
  return (
    <footer className="bg-dark shadow-md fixed bottom-0 left-0 w-full">
      <div className="text-center text-gray-500 text-sm py-4">
        &copy; {new Date().getFullYear()} SistemaReserva. Todos os direitos
        reservados.
        <br />
        Desenvolvido por{" "}
        <a
          href="https://github.com/MMacedoS"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mauricio Macedo
        </a>
      </div>
    </footer>
  );
};

export default Footer;
