import { Margins, Page, } from "../models/report-definition.js";

function address(endereco, cep, uf, cidade, bairro) {
    return `${ endereco }\n${ uf }, ${ cidade } - ${ bairro }\nCEP ${ cep }`;
}

function toOwner({ nome, endereco, telefone, email, cep, uf, cidade, bairro, url, logo }) {
    return {
        name: nome,
        address: address(endereco, cep, uf, cidade, bairro),
        phone: telefone,
        email,
        logo,
    };
}

function definitionToSettings({ id, title, companyInfo }) {
    return {
        name: id,
        title,
        owner: toOwner(companyInfo),
        page: Page.parse({ margins: Margins.parse({}) }),
    };
}

export { definitionToSettings };
