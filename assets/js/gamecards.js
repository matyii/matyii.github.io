function handleCardHover(gameCard) {
    const overlayContent = gameCard.querySelector('.overlay-content');
    if (overlayContent) {
        gameCard.addEventListener('mouseenter', () => {
            overlayContent.classList.remove('opacity-0');
        });

        gameCard.addEventListener('mouseleave', () => {
            overlayContent.classList.add('opacity-0');
        });
    }
}

const allGameCardIds = Array.from(document.querySelectorAll('[id]')).filter(element => element.id.includes('gamecard'));
allGameCardIds.forEach((card) => {
    handleCardHover(card);
});