import "./sql-show-page.html";


Template.Sql_show_page.events({
    "click .js-import-sql": function (e,i) {
        Meteor.call("importSql");
    }
})