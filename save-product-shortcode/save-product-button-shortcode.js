/* Get userID from Wordpress localized_variables */

jQuery(document).ready(function(){

    let filePathURL = "../";

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

    /* Add Saved Product to Session */
    function AddSavedProductRequest(shortCodeProductID) {
        /* If shortCodeProductID isn't in savedProducts add product */
        if (savedProducts.indexOf(shortCodeProductID) == -1) {
            jQuery.post(filePathURL + "AddSavedProduct.php", {
                sessionID: sessionID,
                productID: shortCodeProductID
            });
        }
    }
    

    /* If button clicked with class .shortcode-save-product-button add product to saved products */
    jQuery('.shortcode-save-product-button').click(function(){
        let shortCodeProductID = jQuery(this).attr('value');
        AddSavedProductRequest(shortCodeProductID);
        FetchSavedProducts();
    });

});
