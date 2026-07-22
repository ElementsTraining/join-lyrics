# Script para alinhar estrofes PT-DE-EN em um único arquivo

from os import path

def ler_estrofes(arquivo):
    with open(arquivo, 'r', encoding='utf-8') as f:
        conteudo = f.read().strip()
    # separa estrofes por duas quebras de linha
    estrofes = [e.strip() for e in conteudo.split('\n\n') if e.strip()]
    return estrofes



def run(folder):
    # Arquivos de entrada
    arquivo_pt = path.join(folder,'pt.txt')
    arquivo_de = path.join(folder, 'de.txt')
    arquivo_en = path.join(folder, 'en.txt')
    arquivo_tsonga = path.join(folder, 'tsonga.txt')

    tsonga_exists = False # path.exists(arquivo_tsonga)

    # Lendo estrofes
    estrofes_tsonga = []
    if tsonga_exists:
        estrofes_tsonga = ler_estrofes(arquivo_tsonga)
    estrofes_pt = ler_estrofes(arquivo_pt)
    estrofes_de = ler_estrofes(arquivo_de)
    estrofes_en = ler_estrofes(arquivo_en)

    # Verifica se todos têm o mesmo número de estrofes
    if not (len(estrofes_pt) == len(estrofes_de) == len(estrofes_en)):
        print("⚠️ Atenção: o número de estrofes não é igual entre os idiomas!")
        print(f"PT: {len(estrofes_pt)}, DE: {len(estrofes_de)}, EN: {len(estrofes_en)}")
    else:
        print(f"✔️ Número de estrofes por idioma: {len(estrofes_pt)}")

    # Arquivo de saída
    saida = path.join(folder, 'musica_alinhada.txt')

    en_delimiter = '\n \n' if tsonga_exists else '\n\n' 
    print('has tsonga' if tsonga_exists else 'no tsonga')

    with open(saida, 'w', encoding='utf-8') as f:
        for i in range(len(estrofes_pt)):
            f.write(estrofes_pt[i] + '\n \n')
            f.write(estrofes_de[i] + '\n \n')
            f.write(estrofes_en[i] + en_delimiter )
            if tsonga_exists: 
                f.write(estrofes_tsonga[i] + '\n\n')
            

    print(f"Arquivo '{saida}' gerado com sucesso!")

import os
if __name__ == "__main__":
    args = os.sys.argv[1:]
    folder = ""
    # folder = 'Samuel-messias-os-planos-de-Deus'
    if args:
        folder = args[0]
    else:
        raise ValueError("Por favor, forneça o caminho da pasta como argumento.") 
    run(folder)