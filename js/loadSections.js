document.addEventListener('DOMContentLoaded', async function() {
    await loadSection('header', 'sections/header.html');
    await loadSection('home', 'sections/home.html');
    await loadSection('about', 'sections/about.html');
    await loadSection('skills', 'sections/skills.html');
    await loadSection('projects', 'sections/projects.html');

    // Inicializa o destaque do menu após carregar as seções
    inicializarMenuAtivo();
});

async function loadSection(id, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error('Falha ao carregar a seção: ' + file);
        }

        const html = await response.text();

        console.log("Seção carregada:", file);
        console.log("Conteúdo recebido:", html.length, "caracteres");

        document.getElementById(id).innerHTML = html;

    } catch (error) {
        console.error(error);
        document.getElementById(id).innerHTML =
            '<p>Erro ao carregar esta seção.</p>';
    }
}
