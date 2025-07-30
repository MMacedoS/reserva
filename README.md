# React + TypeScript + Vite

Este projeto utiliza uma configuração moderna para desenvolvimento de aplicações React com TypeScript, utilizando o Vite como bundler. Abaixo estão detalhadas todas as bibliotecas e plugins utilizados, bem como instruções técnicas para configuração e expansão do ambiente.

## Bibliotecas Utilizadas

### Principais

- **[React](https://react.dev/):** Biblioteca para construção de interfaces de usuário.
- **[TypeScript](https://www.typescriptlang.org/):** Superset do JavaScript que adiciona tipagem estática.
- **[Vite](https://vitejs.dev/):** Bundler moderno e rápido para desenvolvimento web.

### Plugins Oficiais do Vite para React

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react):**
  - Utiliza [Babel](https://babeljs.io/) para Fast Refresh e integração com React.
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc):**
  - Utiliza [SWC](https://swc.rs/) como alternativa ao Babel para Fast Refresh, oferecendo maior performance.

### Linting e Qualidade de Código

- **[ESLint](https://eslint.org/):** Ferramenta para análise estática de código JavaScript/TypeScript.
- **[@typescript-eslint](https://typescript-eslint.io/):** Integração do TypeScript com o ESLint.
- **[eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x):** Regras específicas para projetos React com TypeScript.
- **[eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom):** Regras específicas para o React DOM.

## Configuração do ESLint

Para garantir a qualidade do código e aderência às melhores práticas, recomenda-se expandir a configuração do ESLint para incluir regras que consideram o tipo do TypeScript e regras específicas para React.

### Exemplo de Configuração Avançada

```js
// eslint.config.js
import tseslint from '@typescript-eslint/eslint-plugin'
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Configurações recomendadas com checagem de tipos
      ...tseslint.configs.recommendedTypeChecked,
      // Para regras mais estritas
      // ...tseslint.configs.strictTypeChecked,
      // Para regras de estilo
      // ...tseslint.configs.stylisticTypeChecked,
      // Regras específicas para React
      reactX.configs['recommended-typescript'],
      // Regras específicas para React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

## Recomendações

- **Utilize o plugin SWC para maior performance** em projetos grandes.
- **Expanda as regras do ESLint** conforme a necessidade do seu projeto, especialmente para produção.
- **Adicione plugins específicos para React** para garantir melhores práticas e evitar erros comuns.

## Instalação das Dependências

```bash
npm install react react-dom typescript vite @vitejs/plugin-react @vitejs/plugin-react-swc eslint @typescript-eslint/eslint-plugin eslint-plugin-react-x eslint-plugin-react-dom --save-dev
```

## Referências

- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do React](https://react.dev/)
- [Documentação do TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)
- [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)

