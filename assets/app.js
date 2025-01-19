$(document).ready(function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    $('.theme-controller').prop('checked', savedTheme === 'dark');
    $('.theme-controller').change(function() {
        const selectedTheme = $(this).is(':checked') ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('theme', selectedTheme); 
    });

    const path = window.location.pathname;
    $('.tabs a').each(function() {
        if ($(this).attr('href') === path) {
            $(this).addClass('tab-active');
        } else {
            $(this).removeClass('tab-active');
        }
    });

    const currentYear = new Date().getFullYear();
    $('#currentYear').text(currentYear);
});