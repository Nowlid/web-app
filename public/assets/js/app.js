window.addEventListener('load', () => {
    // AOS on home and projects pages
    if (/home|projects/gi.test(document.body.id)) {
        // Loading animation
        setTimeout(() => AOS.init(), 500);

        document.querySelectorAll('main > section').forEach(e => {
            e.setAttribute('data-aos', 'fade-up');
            e.setAttribute('data-aos-duration', '700');
        });

        if (document.body.id === "home") {
            // flexcards.js instance (abilities)
            const flexcards = new FlexCards('section#abilities #mobile.container');

            flexcards.carousel({ theme: "fff", indexType: "dots" });
            flexcards.components.container
                .querySelectorAll('.flexcards__arrow')
                .forEach(e => e.style.display = "none");
        }
    } else if (/login|register/.test(document.body.id)) {
        const form = document.querySelector('section > form');
        const submitBtn = form.querySelector('.btn-box');

        const getState = () => parseInt(form.getAttribute('data-state'));
        const setState = n => form.setAttribute('data-state', String(n));
        const testState = n => setState(Number.isNaN(n) ? 0 : n);

        const registerPage = document.body.id === "register";

        form.addEventListener('submit', e => {
            const currentState = getState();

            if (currentState < (registerPage ? 3 : 2)) {
                e.preventDefault();
                testState(currentState + 1);

                form.querySelectorAll('.input-box > .input-content input')[currentState].blur();
                submitBtn.classList.remove('active');

                switch (getState()) {
                    case 1:
                        if (registerPage) return new TypeIt("section > form .input-box#username label", {
                            speed: 40, afterComplete: c => {
                                c.destroy();
                                const usernameInput = form.querySelector('.input-box#username .input-content');

                                usernameInput.classList.replace('d-none', 'row');
                                usernameInput.querySelector('input').focus();
                                usernameInput.querySelector('input').setAttribute('required', 'on');
                                submitBtn.classList.add('active');
                            },
                        }).type('Entrez votre nom d\'utilisateur<span class="required">*</span>').go();
                        else return new TypeIt("section > form .input-box#password label", {
                            speed: 40, afterComplete: p => {
                                p.destroy();
                                const passwordInput = form.querySelector('.input-box#password .input-content');

                                passwordInput.classList.replace('d-none', 'row');
                                passwordInput.querySelector('input').focus();
                                passwordInput.querySelector('input').setAttribute('required', 'on');
                                submitBtn.querySelector('button').innerHTML = "Se connecter";
                                submitBtn.classList.add('active');
                            },
                        }).type('Entrez votre mot de pase<span class="required">*</span>').go();
                    case 2:
                        if (registerPage) return new TypeIt("section > form .input-box#passwd1 label", {
                            speed: 40, afterComplete: d => {
                                d.destroy();
                                const passwd1Input = form.querySelector('.input-box#passwd1 .input-content');

                                passwd1Input.classList.replace('d-none', 'row');
                                passwd1Input.querySelector('input').focus();
                                passwd1Input.querySelector('input').setAttribute('required', 'on');
                                submitBtn.classList.add('active');
                            },
                        }).type('Entrez votre mot de passe<span class="required">*</span>').go();
                        else {
                            submitBtn.classList.add('active');

                            // Submit form (login)
                            e.preventDefault();
                            console.log("Submit login");
                        }
                        break;
                    case 3: return new TypeIt("section > form .input-box#passwd2 label", {
                        speed: 40, afterComplete: e => {
                            e.destroy();
                            const passwd2Input = form.querySelector('.input-box#passwd2 .input-content');

                            passwd2Input.classList.replace('d-none', 'row');
                            passwd2Input.querySelector('input').focus();
                            passwd2Input.querySelector('input').setAttribute('required', 'on');
                            submitBtn.querySelector('button').innerHTML = "S'inscrire";
                            submitBtn.classList.add('active');
                        },
                    }).type('Confirmez<span class="required">*</span>').go();
                    default: return;
                }
            } else { // Submit form (register)
                console.log("Submit register");
            }
        });

        // First text
        new TypeIt("section > form > p:first-child", {
            startDelay: 2e3,
            speed: 40, afterComplete: a => {
                a.destroy();
                new TypeIt("section > form .input-box#email label", {
                    speed: 40, afterComplete: b => {
                        b.destroy();
                        const emailInput = form.querySelector(".input-box#email .input-content");

                        emailInput.classList.replace('d-none', 'row');
                        emailInput.querySelector('input').focus();
                        emailInput.querySelector('input').setAttribute('required', 'on');
                        submitBtn.classList.add('active');
                    }
                }).type('Entrez votre email<span class="required">*</span>').go();
            },
        }).type(registerPage ? "Bienvenue chez Nowlid !" : "Bon retour chez Nowlid !")
          .pause(1000).break()
          .type(registerPage ? "Commencez votre aventure ici" : "Continuez votre aventure")
          .pause(2000).go();

        testState(0);
    }

    // Menu button
    const navBtn = document.querySelector('header button.dropdown');

    navBtn.addEventListener('click', e => {
        navBtn.classList.toggle('active');
        document.querySelector('header nav').classList.toggle('active');
        navBtn.blur();
    });

    // Loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
        setTimeout(() => document.querySelector('.loader-container').remove(), 1e3);
    }, 500);
});
