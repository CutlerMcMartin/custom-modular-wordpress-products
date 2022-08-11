/* Get userID from Wordpress localized_variables */
let userID = localized_variables.userID;
let sessionID = localized_variables.sessionID;
let filePathURL = "../";
let lastURL = document.referrer;
let goodTags = {};
let badTags = {};
let savedProducts = [];

jQuery(document).ready(function(){

    function userManagmentActive() {
        jQuery("#user-management-prompt").addClass("user-managment-active");
        jQuery("#user-managment-overlay").addClass("overlay-active");
        jQuery("#user-management-back-container").addClass("user-managment-active");
        jQuery("#right-sidebar").addClass("user-management-active");
    }

    function toggleUserDisplayedItems() {
        jQuery("#user-management-header-buttons").toggleClass("logged-in-hidden");
        jQuery("#mobile-user-management-buttons").toggleClass("logged-in-hidden");
        jQuery("#signed-in-user-container").toggleClass("logged-out-hidden");
        jQuery("#mobile-signed-in-user-container").toggleClass("logged-out-hidden");
        jQuery("#logged-out-session-management-container").toggleClass("logged-in-hidden");
        jQuery("#logged-in-session-management-container").toggleClass("logged-out-hidden");
    }

    /* Display Login Prompt */
    jQuery(".login-button").click(function() {
        userManagmentActive();
        loginToggleHeader();
    });

    /* Display Sign Up Prompt */
    jQuery(".signup-button").click(function() {
        userManagmentActive();
        signUpToggleHeader();
    });

    jQuery("#user-managment-back").click(function() {
        jQuery("#user-management-prompt").removeClass("user-managment-active");
        jQuery("#user-managment-overlay").removeClass("overlay-active");
        jQuery("#user-management-back-container").removeClass("user-managment-active");
        jQuery("#right-sidebar").removeClass("user-management-active");
    });

    function signUpToggleHeader() {
        jQuery("#signup-toggle-header").removeClass("toggle-header-unselected");
        jQuery("#signup-toggle-header").addClass("toggle-header-selected");
        jQuery("#login-toggle-header").removeClass("toggle-header-selected");
        jQuery("#login-toggle-header").addClass("toggle-header-unselected");
        jQuery("#login-user-container").addClass("toggle-menu-containter-unselected");
        jQuery("#signup-user-container").removeClass("toggle-menu-containter-unselected");
        clearWarnings();
    }

    jQuery("#signup-toggle-header").click(function() {
        signUpToggleHeader();
    })

    function loginToggleHeader() {
        jQuery("#login-toggle-header").removeClass("toggle-header-unselected");
        jQuery("#login-toggle-header").addClass("toggle-header-selected");
        jQuery("#signup-toggle-header").removeClass("toggle-header-selected");
        jQuery("#signup-toggle-header").addClass("toggle-header-unselected");
        jQuery("#signup-user-container").addClass("toggle-menu-containter-unselected");
        jQuery("#login-user-container").removeClass("toggle-menu-containter-unselected");
        clearWarnings();
    }

    jQuery("#login-toggle-header").click(function() {
        loginToggleHeader();
    })

    function clearWarnings() {
        jQuery("#login-wrong-creditials-warning").addClass("user-managment-warning-hide");
        jQuery("#login-blank-input-warning").addClass("user-managment-warning-hide");
        jQuery("#signup-blank-input-warning").addClass("user-managment-warning-hide");
        jQuery("#signup-duplicate-username-warning").addClass("user-managment-warning-hide");
        jQuery("#login-username-invalid-characters-warning").addClass("user-managment-warning-hide");
        jQuery("#signup-username-invalid-characters-warning").addClass("user-managment-warning-hide");
        jQuery("#login-password-invalid-characters-warning").addClass("user-managment-warning-hide");
        jQuery("#signup-password-invalid-characters-warning").addClass("user-managment-warning-hide");
    };

    function isUserNameValid(userNameToCheck) {
        const res = /^\w(?:\w|[.-](?=\w)){1,31}$/.exec(userNameToCheck);
        const valid = !!res;
        return valid;
    }

    function isPasswordValid(userPasswordToCheck) {
        const res = /^\w(?:\w|[.-](?=\w)){5,31}$/.exec(userPasswordToCheck);
        const valid = !!res;
        return valid;
    }

    function areCredsValide(userNameToCheck, userPasswordToCheck){
        if (!isUserNameValid(userNameToCheck)) {
            jQuery("#login-username-invalid-characters-warning").removeClass("user-managment-warning-hide");
            jQuery("#signup-username-invalid-characters-warning").removeClass("user-managment-warning-hide");
            return false;
        }
        if (!isPasswordValid(userPasswordToCheck)) {
            jQuery("#login-password-invalid-characters-warning").removeClass("user-managment-warning-hide");
            jQuery("#signup-password-invalid-characters-warning").removeClass("user-managment-warning-hide");
            return false;
        }
        return true;
    }

    /* Sign Up User */
    jQuery("#signup-user-button").unbind().click(function(){
        let signUpUserName = jQuery("#username-signup-input").val();
        let fakePassword = jQuery("#password-wrong-signup-input").val();
        let assignedPassword = jQuery("#password-signup-input").val();
        clearWarnings();
        if (fakePassword) {
            return;
        }
        if (!signUpUserName | !assignedPassword) {
            jQuery("#signup-blank-input-warning").removeClass("user-managment-warning-hide");
            return;
        }
        if (!areCredsValide(signUpUserName, assignedPassword)){
            console.log("fakePassword");
            return;
        }
        jQuery.post(filePathURL + "SignUpUser.php", { signUpUserName: signUpUserName, assignedPassword: assignedPassword, sessionID: sessionID })
            .done(function(data) {
                if (data == "Duplicate Name") {
                    jQuery("#signup-duplicate-username-warning").removeClass("user-managment-warning-hide");
                } else {
                    userID = data;
                    /* Assign the session that is currently being worked on into the new user */
                    jQuery.post(filePathURL + "SignUpFirstSession.php", {
                        sessionID: sessionID,
                        userID: userID
                    }).done(function(data){
                        DisplayPersonDropdown();
                        toggleUserDisplayedItems();
                        if (data != 0) {
                            jQuery("#user-name-display").html("Hello, " + signUpUserName);
                            jQuery("#mobile-user-name-display").html("Hello, " + signUpUserName);
                            jQuery("#user-management-header-buttons").addClass("user-logged-in");
                            jQuery("#user-management-prompt").removeClass("user-managment-active");
                            jQuery("#user-managment-overlay").removeClass("overlay-active");
                            jQuery("#user-management-back-container").removeClass("user-managment-active");
                            jQuery("#right-sidebar").removeClass("user-management-active");
                        }
                    });
                }
            });
        
    });

    /* Log In User */
    jQuery("#login-user-button").unbind().click(function() {
        let loginUsername = jQuery("#username-login-input").val();
        let fakePassword = jQuery("#password-wrong-signup-input").val();
        let loginPassword = jQuery("#password-login-input").val();
        clearWarnings();
        if (fakePassword) {
            return;
        }
        if (!loginUsername | !loginPassword) {
            jQuery("#login-blank-input-warning").removeClass("user-managment-warning-hide");
            return;
        }
        if (!areCredsValide(loginUsername, loginPassword)){
            return;
        }
        tempSessionID = sessionID;
        jQuery.get(filePathURL + "LoginUser.php", {loginUsername: loginUsername, loginPassword: loginPassword}, function( data ) {
            if ( data == 0 ) {
                jQuery("#login-wrong-creditials-warning").removeClass("user-managment-warning-hide");
            } else {
                userID = data;
                jQuery("#user-management-prompt").removeClass("user-managment-active");
                jQuery("#user-management-back-container").removeClass("user-managment-active");
                /* Check to see if there were any tags added, saved gifts or if sliders were changed */
                let offerSessionSave = (!jQuery.isEmptyObject(goodTags) | !jQuery.isEmptyObject(badTags) | Boolean(savedProducts.length));
                if (offerSessionSave) {
                    /* Show popup to ask question */
                    jQuery("#session-retain-check-container").addClass("session-check-active");
                    jQuery("#user-managment-overlay").addClass("overlay-active");
                    jQuery("#right-sidebar").removeClass("user-management-active");
                } else {
                    jQuery("#user-managment-overlay").removeClass("overlay-active");
                    jQuery("#right-sidebar").removeClass("user-management-active");
                }
                DisplayPersonDropdown();
                toggleUserDisplayedItems();
                freshDropdown = true;
                jQuery("#user-name-display").html("Hello, " + loginUsername);
                jQuery("#mobile-user-name-display").html("Hello, " + loginUsername);
                jQuery.post(filePathURL + "SetWDIGSessionID.php", {
                    sessionID: sessionID
                });
            }
        });
    });

    /* Log Out */
    jQuery(".logout-button").unbind().click(function() {
        jQuery.get(filePathURL + "LogOut.php");
        userID = 0;
        NewSession(true);
        toggleUserDisplayedItems();
    });

    function NewSession(fromLogout = false) {
        jQuery.post(filePathURL + "NewSession.php", {lastURL: lastURL, userID: userID})
            .done(function(data) {
                jQuery.post(filePathURL + "SetWDIGSessionID.php", {
                    sessionID: sessionID
                });
                if (fromLogout) {
                    goodTags = {};
                    badTags = {};
                    saveProducts = [];
                    jQuery("#saved-gifts-container").empty();
                } else {
                    if(userID != 0){
                        DisplayPersonDropdown();
                    }
                }
            });
    }

    /* Get Desired Session */
    function GetSession() {
        jQuery.get(filePathURL + "GetSession.php", {sessionID: sessionID}, function( data ) {
            if ( data == 0 ) {
                console.log("Error on Session Load");
            } else {
                session = JSON.parse(data)[0];
                goodTags = JSON.parse(session.GoodTags);
                badTags = JSON.parse(session.BadTags);;
                FetchSavedProducts();
                jQuery.post(filePathURL + "SetWDIGSessionID.php", {
                    sessionID: sessionID
                });
            }
        });
    }

    /* Display Persons in Dropdown */
    function DisplayPersonDropdown() {
        jQuery.get(filePathURL + "GetSessionsUnderUser.php", {userID: userID}, function(data) {
            if ( data == 0 ) {
                console.log("No Results");
            } else {
                let sessions = JSON.parse(data);
                jQuery("#sessions-under-user").empty();
                sessionDropdownHTML = "";
                let displaySessionName = "";
                let i = 1;
                sessions.forEach(sesh =>{
                    if(sesh.SessionName != null) {
                        displaySessionName = sesh.SessionName;
                    } else {
                        displaySessionName = "Person " + i;
                    }
                    jQuery("#sessions-under-user").append("<option value='" + sesh.id + "'>" + displaySessionName + "</option>");
                    i += 1;
                })
                jQuery("#sessions-under-user option[value='" + sessionID + "']").prop('selected', true);
                if (sessions.length > 1) {
                    jQuery("#delete-session-button").removeClass("no-delete-session");
                    jQuery("#add-new-session-button").removeClass("no-delete-session");
                } else {
                    jQuery("#delete-session-button").addClass("no-delete-session");
                    jQuery("#add-new-session-button").addClass("no-delete-session");

                }
            }
        });
    }

    /* Changing the Session based off the dropdown */
    jQuery("#sessions-under-user").change(function() {
        sessionID = jQuery(this).val();
        GetSession();
    });

    /* Add New Person */
    function AddNewPerson() {
        jQuery.post(filePathURL + "NewSession.php", {
            userID: userID
        }, function(data) {
            if ( data == 0 ) {
                console.log("Error on Person Add");
            } else {
                DisplayPersonDropdown();
            }
        })
    }

    /* Add Session Button */
    jQuery("#add-new-session-button").click(function() {
        AddNewPerson();
    });

    /* Assigning a name to the Person */
    function AssignPersonName() {
        let sessionName = jQuery("#assign-session-name").val();
        jQuery.post(filePathURL + "AssignNameToSession.php", {
            sessionID: sessionID,
            sessionName: sessionName
        }).done(function() {
            DisplayPersonDropdown();
        });
    }
    
    if (userID == null) {
        userID = 0;
        NewSession();
    } else {
        DisplayPersonDropdown();    
    }

    GetSession();

    /* Changing the Session based off the dropdown */
    jQuery("#sessions-under-user").change(function() {
        GetSession();
    });

    jQuery("#assign-session-name-button").click(function() {
        AssignPersonName();
    });

    /* Fetch Saved Products of Session */
    function FetchSavedProducts() {
        jQuery.get(filePathURL + "FetchSavedProducts.php", {
            sessionID: sessionID
        }, function (data) {
            let products = JSON.parse(data);
            jQuery("#saved-gifts-container").empty();
            savedProducts = [];
            products.forEach(prod => {
                ProductTitle = prod.Title;
                ProductPicture = prod.ProductPicture;
                ProductLink = prod.AffiliateLink;
                ProductID = prod.ProductID;
                savedGiftHtml = '<div id="saved-product-' + ProductID + '" class="saved-gift-unit">' +
                '<div class="saved-gift-picture">' + ProductPicture + '</div>' +
                '<div class="saved-gift-title"> <a href="' + ProductLink + '" class="saved-gift-text-link" target="_blank"><p>' + ProductTitle + '</p></a> </div>' + 
                '<div class="delete-saved-product" value="' + ProductID + '"><p class="delete-saved-product-text">Delete</p></div>'
                '</div>';
                jQuery("#saved-gifts-container").append(savedGiftHtml);
                savedProducts.push(ProductID);
            });
            if (savedProducts.length > 0) {
                jQuery("#no-gifts-saved").addClass("saved-products-exist");
                jQuery("#saved-gifts-container").removeClass("saved-products-does-not-exist");
            } else {
                jQuery("#no-gifts-saved").removeClass("saved-products-exist");
                jQuery("#saved-gifts-container").addClass("saved-products-does-not-exist");
            }
        }
    )}

    /* Saved Area Toggle */
    jQuery("#saved-item-menu-toggle").click(function(){
        jQuery("#saved-item-holding-area").toggleClass("saved-items-active");
        jQuery("#toggle-overlay").toggleClass("overlay-active");
        jQuery("header").toggleClass("overlay-active");
        jQuery("#product-container").toggleClass("overlay-active");
        jQuery(".saved-items-toggle-arrows").toggleClass("saved-items-active");
        jQuery("#saved-gifts-container").toggleClass("saved-items-active");
        jQuery("#saved-item-area").toggleClass("saved-items-active");
    })

    /* Left Sidebar Mobile Toggle */
    jQuery("#left-sidebar-toggle").click(function(){
        jQuery("#left-sidebar").toggleClass("left-sidebar-active");
        jQuery("#toggle-overlay").toggleClass("overlay-active");
        jQuery("header").toggleClass("overlay-active");
        jQuery("#product-container").toggleClass("overlay-active");
        jQuery(".left-sidebar-toggle-arrows").toggleClass("left-sidebar-active");
        jQuery("#left-sidebar-content").toggleClass("left-sidebar-active");
    });

    /* Right Sidebar Mobile Toggle */
    jQuery("#right-sidebar-toggle").click(function(){
        jQuery("#right-sidebar").toggleClass("right-sidebar-active");
        jQuery("#toggle-overlay").toggleClass("overlay-active");
        jQuery("header").toggleClass("overlay-active");
        jQuery("#product-container").toggleClass("overlay-active");
        jQuery(".right-sidebar-toggle-arrows").toggleClass("right-sidebar-active");
    });

});

jQuery(document).ajaxStop(function(){

    /* Populating the stored tags */
    function populateSelectedTags() {

        let selectedGoodTagOutput = '';
        for(var i in goodTags){
            selectedGoodTagOutput += '<div class="active-good-tag-unit tag-unit">' +
                '<div class="deactivate-good-tag-input deactivate-input" value="' + i + '"><img src="' + filePathURL + 'inc/icons/bad-tag.svg" alt="Remove"></div>' +
                '<div class="active-good-tag-label">' + goodTags[i] + '</div></div>';
        };
        jQuery('#active-good-tag-container').html(selectedGoodTagOutput);
        jQuery("#no-good-tags-text").addClass("tags-empty-true");
        if(Object.keys(goodTags).length == 0){
            jQuery("#no-good-tags-text").removeClass("tags-empty-true");
        };

        let selectedBadTagOutput = '';
        for(var i in badTags){
            selectedBadTagOutput += '<div class="active-bad-tag-unit tag-unit">' +
                '<div class="deactivate-bad-tag-input deactivate-input" value="' + i + '"><img src="' + filePathURL + 'inc/icons/bad-tag.svg" alt="Remove"></div>' +
                '<div class="active-bad-tag-label">' + badTags[i] + '</div></div>';
        };
        jQuery('#active-bad-tag-container').html(selectedBadTagOutput);
        jQuery("#no-bad-tags-text").addClass("tags-empty-true");
        if(Object.keys(badTags).length == 0){
        jQuery("#no-bad-tags-text").removeClass("tags-empty-true");
        }

            /* Adding the action listeners for the delete inputs after they were added to the document */
            jQuery('.deactivate-good-tag-input').unbind().click(function(){
                let thisTag = jQuery(this).attr("value");
                delete goodTags[thisTag];
                
                populateSelectedTags();
                selectTagVisualLogic();
            });

            jQuery('.deactivate-bad-tag-input').unbind().click(function(){
                let thisTag = jQuery(this).attr("value");
                delete badTags[thisTag];
                populateSelectedTags();
                selectTagVisualLogic();
            });
    };

    populateSelectedTags();


    /* Sending the request to delete the Product in the back  */
    function DeleteSavedProductRequest(productIDToDelete) {
        jQuery.post(filePathURL + "DeleteSavedProduct.php", {
            sessionID: sessionID,
            productID: productIDToDelete
        });
    }

    /* Delete Product */
    jQuery("#saved-gifts-container .saved-gift-unit").unbind().on("click", ".delete-saved-product", function(e){
        // Getting the ID of the product that was selected to be deleted
        let deleteProductID = jQuery(this).attr("value");
        // Deleting the Saved Product unit from the list on page DOM
        jQuery("#saved-product-" + deleteProductID).remove();
        // Deleting the Saved Product from the Array savedProducts
        let index = savedProducts.indexOf(deleteProductID);
        if (index !== -1) {
            savedProducts.splice(index, 1);
        }
        if (savedProducts.length == 0) {
            jQuery("#no-gifts-saved").removeClass("saved-products-exist");
            jQuery("#saved-gifts-container").addClass("saved-products-does-not-exist");
        }
        DeleteSavedProductRequest(deleteProductID);
    });
    
});