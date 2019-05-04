import { EstadoDTO } from "./estado.dto";

// ? signica que o campo é opcional
export interface CidadeDTO{
    id: string;
    nome: string;
    estado?:EstadoDTO;
}