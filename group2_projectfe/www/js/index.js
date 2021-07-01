$(function () {
    if (!sessionStorage.ttoken || sessionStorage.ttoken === null)
        location.href = "login.html";

    //$("#idSpan").val = sessionStorage.ttoken;
    document.getElementById("idSpan").innerHTML = sessionStorage.ttoken;


    var link1 = crossroads.addRoute("/logout", function () {
        sessionStorage.clear();
        location.href = "login.html";
    });

    var link2 = crossroads.addRoute("", function () {
        $("#divHome").show();
        $("#divRecipe").hide();
        $("#divAddRecipe").hide();
    });

    var link4 = crossroads.addRoute("/btnAddRecipe", function () {
        $("#divHome").hide();
        $("#divRecipe").hide();
        $("#divAddRecipe").show();
        $("#divEditContact").hide();
    });


    var link3 = crossroads.addRoute("/recipe", function () {
        $(".navbar-collapse li").removeClass("active");
        $(".navbar-collapse li a[href='#recipe']").parent().addClass("active");
        var email = sessionStorage.ttoken;
        var datalist = "email=" + email;
        $.ajax({
            type: "post",
            url: "http://192.168.188.29:8080/group2/GetRecipe",
            data: datalist,
            cache: false,
            success: function (mydata) {
                var myData = JSON.parse(mydata);

                var lastIndex = myData.length - 1;
                var htmlText = "";
                if (myData[lastIndex].status === 1) {
                    for (var i = 0; i < lastIndex; i++) {
                        htmlText = htmlText + "<tr><td>" + myData[i].id
                            + "</td><td><a href='#viewrecipe/" + myData[i].id + "'>" + myData[i].topic
                            + "</a></td><td>" + myData[i].ingredient
                            + "</td><td>" + myData[i].step
                            + "</td><td><a href='#delrecipe'><span class='glyphicon glyphicon-trash' data-recipeid="
                            + myData[i].id
                            + "></span></a></td></tr>";
                    }

                    $("#tblRecipe tbody").html(htmlText);
                }
            },
            error: function () {
                console.log("ajax error!");
                alert("Please contact admin!");
            }
        });
        $("#divHome").hide();
        $("#divRecipe").show();
        $("#divAddRecipe").hide();
        $("#divEditRecipe").hide();
    });


    var link5 = crossroads.addRoute("/viewrecipe/{id}", function (id) {

        var datalist = "id=" + id;
        $.ajax({
            type: "post",
            url: "http://192.168.188.29:8080/group2/GetRecipeById",
            data: datalist,
            cache: false,
            success: function (mydata) {
                var myData = JSON.parse(mydata);

                if (myData.status === 1) {
                    document.getElementById("topic100").value = myData.topic;
                    document.getElementById("ingredient100").value = myData.ingredient;
                    document.getElementById("step100").value = myData.step;
                    document.getElementById("recipeid").value = myData.id;
                }
                $("#divHome").hide();
                $("#divRecipe").hide();
                $("#divAddRecipe").hide();
                $("#divEditRecipe").show();
            },
            error: function () {
                console.log("ajax error!");
                alert("Please contact admin!");
            }
        });
    });


    $("#frmAddRecipe").submit(function (e) {
        e.preventDefault();
        e.stopPropagation();

        var topic = $("#topic").val();
        var ingredient = $("#ingredient").val();
        var step = $("#step").val();
        var email = $("#email").val();

        var datalist = "topic=" + topic + " &ingredient=" + ingredient + "&step=" + step + "&email=" + email + "&owner=" + sessionStorage.ttoken;
        $.ajax({
            type: "post",
            url: "http://192.168.188.29:8080/group2/AddRecipe",
            data: datalist,
            cache: false,
            success: function (mydata) {
                var myData = JSON.parse(mydata);
                if (myData.status === 1) {
                    alert("Add Recipe Success!");
                    $("#divHome").hide();
                    $("#divRecipe").hide();
                    $("#divAddRecipe").show();
                    $("#divEditRecipe").hide();
                }
                else {
                    alert("Add Recipe Failed");
                }
            },
            error: function () {
                console.log("ajax error!");
                alert("Please contact admin!");
            }
        });
    });

    $("#frmEditRecipe").submit(function (e) {
        e.preventDefault();
        e.stopPropagation();

        var topic = $("#topic100").val();
        var ingredient = $("#ingredient100").val();
        var step = $("#step100").val();
        var recipeid = $("#recipeid").val();

        var datalist = "topic=" + topic + "&ingredient=" + ingredient + "&step=" + step + "&recipeid=" + recipeid;
        $.ajax({
            type: "post",
            url: "http://192.168.188.29:8080/group2/UpdateRecipeById",
            data: datalist,
            cache: false,
            success: function (mydata) {
                var myData = JSON.parse(mydata);
                if (myData.status === 1) {
                    alert("Update Recipe Success!");
                    $("#divHome").hide();
                    $("#divRecipe").hide();
                    $("#divAddRecipe").hide();
                    $("#divEditRecipe").show();
                }
                else {
                    alert("Update Recipe Failed");
                }
            },
            error: function () {
                console.log("ajax error!");
                alert("Please contact admin!");
            }
        });
    });

    $("#tblRecipe tbody").on("click", "span", function () {
        var recipeid = $(this).data("recipeid");
        //bootbox.alert("Delete process" +recipeid); 
        datalist = "recipeid=" + recipeid;
        var parentTR = $(this).parent().parent().parent();
        bootbox.confirm("Are you sure to delete this recipe?", function (answer) {
            if (answer) {
                $.ajax({
                    type: "post",
                    url: "http://192.168.188.29:8080/group2/DelRecipe",
                    data: datalist,
                    cache: false,
                    success: function (mydata) {
                        var myData = JSON.parse(mydata);
                        if (myData.status === 1) {
                            alert("Delete Recipe Successfull!");
                            $(parentTR).fadeOut("slow", "swing", function () {
                                $(parentTR).remove();
                                //$("#divEditRecipe").hide();
                                //$("#divRecipe").show();
                            });
                        }
                        else {
                            alert("Delete Recipe Failed");
                        }
                    },
                    error: function () {
                        console.log("ajax error!");
                        alert("Please contact admin!");
                    }
                });
            }
            else {
                bootbox.alert("Delete canceled!");
            }
        });
    });


    function parseHash(newHash, oldHash) {
        crossroads.parse(newHash);
    }

    hasher.initialized.add(parseHash);
    hasher.changed.add(parseHash);
    hasher.init();

});