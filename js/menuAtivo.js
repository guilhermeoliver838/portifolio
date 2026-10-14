function inicializarMenuAtivo() {
    const linksMenu = document.querySelectorAll('.nav-links');

    const secoes = [
        { id: 'home', link: '#home' },
        { id: 'quem-sou', link: '#quem-sou' },
        { id: 'secao-skills', link: '#secao-skills' },
        { id: 'projects', link: '#projects' }
    ];

    function atualizarMenu() {
        let secaoAtual = secoes[0];

        for (const secao of secoes) {
            const elemento = document.getElementById(secao.id);

            if (!elemento) continue;

            const posicao = elemento.getBoundingClientRect().top;

            if (posicao <= window.innerHeight * 0.4) {
                secaoAtual = secao;
            }
        }

        linksMenu.forEach(link => {
            const ativo = link.getAttribute('href') === secaoAtual.link;

            link.classList.toggle('active', ativo);
        });
    }

    window.addEventListener('scroll', atualizarMenu);
    window.addEventListener('resize', atualizarMenu);

    atualizarMenu();
}
