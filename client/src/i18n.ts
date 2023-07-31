import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    es: {
        translation: {
            welcome: "Bienvenido",
            questions: "preguntas",
            next: "Siguiente",
            success: "Prueba completada!"
        },
    },
};

void i18n.use(initReactI18next).init({
    resources,
    lng: "es",
    debug: true,
});

export default i18n;
