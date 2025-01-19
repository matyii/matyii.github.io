async function loadProjects() {
    try {
        const response = await fetch('assets/projects.json');
        const projects = await response.json();

        const container = document.querySelector('.projects');

        projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.classList.add('card', 'bg-base-100', 'image-full', 'w-96', 'shadow-xl', 'mb-4');
            projectElement.innerHTML = `
                <figure>
                    <img src="${project.image}" alt="${project.title}">
                </figure>
                <div class="card-body">
                    <h2 class="card-title">${project.title}</h2>
                    <div class="flex flex-wrap gap-2">
                        ${project.badges.map(badge => `
                            <span class="badge badge-sm badge-${badge.type}">${badge.label}</span>
                        `).join('')}
                    </div>
                    <p>${project.description}</p>
                    <div class="card-actions justify-end">
                        ${project.links.map(link => `
                            <a href="${link.url}" target="_blank" class="btn btn-ghost">${link.label}</a>
                        `).join('')}
                    </div>
                </div>
            `;

            container.appendChild(projectElement);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProjects);