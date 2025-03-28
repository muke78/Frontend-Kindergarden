import { useState } from "react";

import { v } from "../styles/variables";

interface PropsPaginacion {
  pagina: number;
  setPagina: React.Dispatch<React.SetStateAction<number>>;
  maximo: number;
}

export const Paginacion = ({ pagina, setPagina, maximo }: PropsPaginacion) => {
  const [input, setInput] = useState<number>(1);

  const nextPage = () => {
    setInput(input + 1);
    setPagina(pagina + 1);
  };

  const previousPage = () => {
    setInput(input - 1);
    setPagina(pagina - 1);
  };
  const inicio = () => {
    setInput(1);
    setPagina(1);
  };

  const final = () => {
    setInput(Math.ceil(maximo));
    setPagina(Math.ceil(maximo));
  };

  return (
    <div className="flex justify-center items-center gap-4 p-2">
      <button
        className="btn btn-soft btn-secondary btn-sm"
        onClick={inicio}
        aria-label="Ir hasta el principio"
      >
        <span>{<v.iconoContraerMenu />}</span>
      </button>
      <button
        className="btn btn-secondary btn-sm"
        aria-label="Anterior pagina"
        disabled={pagina === 1 || pagina < 1}
        onClick={previousPage}
      >
        <span className="iconoIzquierda">{<v.iconoFlechaIzquierda />}</span>
      </button>
      <span>{input}</span>
      <p> de {Math.round(maximo)} </p>
      <button
        className="btn btn-secondary btn-sm"
        aria-label="Siguiente pagina"
        disabled={pagina === Math.ceil(maximo) || pagina > Math.ceil(maximo)}
        onClick={nextPage}
      >
        <span>{<v.iconoFlechaDerecha />}</span>
      </button>
      <button
        className="btn btn-soft btn-secondary btn-sm"
        onClick={final}
        aria-label="Ir hasta el final"
      >
        <span>{<v.iconoDesplegarMenu />}</span>
      </button>
    </div>
  );
};
