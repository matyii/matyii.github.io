async function loadProjects() {
    try {
        const response = await fetch('assets/projects.json');
        const projects = await response.json();

        const container = document.querySelector('.projects');

        projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.classList.add('row', 'align-items-center', 'mb-4');
            projectElement.innerHTML = `
                <div class="col-md-3">
                    <img src="${project.image}" class="img-fluid rounded shadow mb-3 imgzoom">
                </div>
                <div class="col-md-6">
                    <h5 class="fw-bold">${project.title}</h5>
                    <p class="text-muted">${project.description}</p>
                </div>
                <div class="col-md-3 text-md-end">
                    ${project.links.map(link => `
                        <a href="${link.url}" target="_blank" class="btn btn-outline-light">${link.label}</a>
                    `).join('')}
                </div>
            `;

            container.appendChild(projectElement);
            const hr = document.createElement('hr');
            container.appendChild(hr);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProjects);