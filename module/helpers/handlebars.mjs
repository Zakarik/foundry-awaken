export const RegisterHandlebars = function () {
    Handlebars.registerHelper('getSelect', function (name) {
        return CONFIG.AWAKEN.SELECT[name];
    });
}