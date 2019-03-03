"use strict";

const ui = {
   //#region UI State Variables
   currentView: null,
   //#endregion



   //#region UI Views
   landingView: {
      //#region Element jQuery Selectors
      $view: $("#js-view-landing"),
      $headerButtons: {
         $signIn: $("#js-headerButton-signIn")
      },
      $registerButton: $("#js-landing-button-register"),
      //#endregion

      configureEventListeners: function() {
         ui.landingView.$headerButtons.$signIn.on("click", async function(e) {
            await ui.hideCurrentView("fadeOutLeft");
            ui.signInView.show("fadeInRight");
         });

         ui.landingView.$registerButton.on("click", async function(e) {
            await ui.hideCurrentView("fadeOutLeft");
            ui.registerView.show("fadeInRight");
         });
      },
      beforeShow: function() {
         return new Promise((resolve, reject)=> {
            //No functionality required yet
            resolve();
         });
      },
      show: async function(showAnimation="fadeIn") {
         ui.validateShowAnimation(showAnimation);
         await ui.landingView.beforeShow();
         ui.showView(ui.landingView, showAnimation);
      },
   },

   registerView: {
      //#region jQuery Selectors
      $view: $("#js-view-register"),
      $headerButtons: {
         $signInInstead: $("#js-headerButton-signInInstead")
      },

      //Form Elements
      $formFeedback: $("#js-register-formFeedback"),
      $usernameInput: $("#js-register-input-username"),
      $usernameLabel: $("#js-register-label-username"),
      $emailInput: $("#js-register-input-email"),
      $emailLabel: $("#js-label-register-email"),
      $passwordInput: $("#js-register-input-password"),
      $passwordLabel: $("#js-register-label-password"),
      $confirmPasswordInput: $("#js-register-input-confirmPassword"),
      $confirmPasswordLabel: $("#js-register-label-confirmPassword"),
      $submitButton: $("#js-register-button-submit"),
      //#endregion

      //#region Initial Values
      initialFormFeedback: $("#js-register-formFeedback").text(),
      initialUsernameLabel: $("#js-register-label-username").text(),
      initialEmailLabel: $("#js-label-register-email").text(),
      initialPasswordLabel: $("#js-register-label-confirmPassword").text(),
      initialConfirmPasswordLabel: $("#js-register-label-confirmPassword").text(),
      //#endregion

      //#region State Variables
      usernameInputIsValid: false,
      emailInputIsValid: true,
      passwordInputIsValid: false,
      confirmPasswordInputIsValid: false,
      //#endregion

      configureEventListeners: function() {
         ui.registerView.$headerButtons.$signInInstead.on("click", async function(e) {
            await ui.hideCurrentView("fadeOutLeft");
            ui.signInView.show("fadeInRight");
         });

         $("#form-register").on("submit", function(e) {
            //Prevents unnecessary refreshing behavior.
            //The form's submit button interprets the submit event on behalf of the form element.
            e.preventDefault();
         });

         ui.registerView.$usernameInput.on("input", function(e) {
            ui.registerView.validateUsernameInput();
            ui.registerView.validateForm();
         });

         ui.registerView.$emailInput.on("input", function(e) {
            ui.registerView.validateEmailInput();
            ui.registerView.validateForm();
         });

         ui.registerView.$passwordInput.on("input", function(e) {
            ui.registerView.validatePasswordInput();
            ui.registerView.validateForm();
         });

         ui.registerView.$confirmPasswordInput.on("input", function(e) {
            ui.registerView.validateConfirmPasswordInput();
            ui.registerView.validateForm();
         });

         ui.registerView.$submitButton.on("click", async function(e) {
            ui.registerView.setFormFeedback("Registering...");
            await ui.registerView.createUser(
               ui.registerView.$usernameInput.val(),
               ui.registerView.$passwordInput.val(),
               ui.registerView.$emailInput.val()
            );
         });
      },
      beforeShow: function() {
         return new Promise((resolve, reject)=> {
            ui.registerView.reset();
            resolve();
         });
      },
      show: async function(showAnimation="fadeIn") {
         ui.validateShowAnimation(showAnimation);
         await ui.registerView.beforeShow();
         ui.showView(ui.registerView, showAnimation);
      },
      reset: function() {
         //With only one call, this reset method is hard to justify, but it maintains consistency with other views that have more complex reset behaviors.
         ui.registerView.resetForm();
      },

      setFormFeedback: function(feedback, isError=false) {
         ui.registerView.$formFeedback.text(feedback);
         (isError) ?
            ui.registerView.$formFeedback.css("color", "#FF8A80")
            : ui.registerView.$formFeedback.css("color", "");
      },
      enableSubmitButton: function() {
         ui.registerView.$submitButton.prop("disabled", false);
      },
      disableSubmitButton: function() {
         ui.registerView.$submitButton.prop("disabled", true);
      },
      resetUsernameField: function() {
         ui.registerView.$usernameInput.val("");
         ui.registerView.$usernameLabel.text(ui.registerView.initialUsernameLabel);
         ui.signInView.$usernameLabel.removeClass("invalid");
         ui.registerView.usernameInputIsValid = false;
         ui.registerView.disableSubmitButton();
      },
      resetEmailField: function() {
         ui.registerView.$emailInput.val("");
         ui.registerView.$emailLabel.text(ui.registerView.initialEmailLabel);
         ui.signInView.$emailLabel.removeClass("invalid");
         ui.registerView.emailInputIsValid = true;
         ui.registerView.disableSubmitButton();
      },
      resetPasswordField: function() {
         ui.registerView.$passwordInput.val("");
         ui.registerView.$passwordLabel.text(ui.registerView.initialPasswordLabel);
         ui.signInView.$passwordLabel.removeClass("invalid");
         ui.registerView.passwordInputIsValid = false;
         ui.registerView.disableSubmitButton();
      },
      resetConfirmPasswordField: function() {
         ui.registerView.$confirmPasswordInput.val("");
         ui.registerView.$confirmPasswordLabel.text(ui.registerView.initialConfirmPasswordLabel);
         ui.signInView.$confirmPasswordLabel.removeClass("invalid");
         ui.registerView.confirmPasswordInputIsValid = false;
         ui.registerView.disableSubmitButton();
      },
      resetForm: function() {
         ui.registerView.setFormFeedback(ui.registerView.initialFormFeedback);
         ui.registerView.resetUsernameField();
         ui.registerView.resetEmailField();
         ui.registerView.resetPasswordField();
         ui.registerView.resetConfirmPasswordField();
         ui.registerView.disableSubmitButton();
      },

      validateUsernameInput: function() {
         const enteredUsername = ui.registerView.$usernameInput.val();
         ui.registerView.usernameInputIsValid = false;

         if(!enteredUsername) {
            ui.registerView.$usernameLabel.addClass("invalid");
            ui.registerView.$usernameLabel.text("Username is blank.");
         }

         else if(enteredUsername.trim().length != enteredUsername.length) {
            ui.registerView.$usernameLabel.addClass("invalid");
            ui.registerView.$usernameLabel.text("Username begins/ends with whitespace.");
         }

         else {
            ui.registerView.$usernameLabel.removeClass("invalid");
            ui.registerView.$usernameLabel.text(ui.registerView.initialUsernameLabel);
            ui.registerView.usernameInputIsValid = true;
         }
      },
      validateEmailInput: function() {
         const enteredEmail = ui.registerView.$emailInput.val();
         const emailRegex = /[0-9a-zA-Z!#$%&'"*/=.?^_+\-`{|}~]+@{1}[^@\s]+/;

         //If a en email has been entered, but it does not adhere to the provided regular expression
         if(enteredEmail!="" && enteredEmail!=enteredEmail.match(emailRegex)) {
            ui.registerView.$emailLabel.addClass("invalid");
            ui.registerView.$emailLabel.text("Email is invalid.");
            ui.registerView.emailInputIsValid = false;
         }

         else {
            ui.registerView.$emailLabel.removeClass("invalid");
            ui.registerView.$emailLabel.text(ui.registerView.initialEmailLabel);
            ui.registerView.emailInputIsValid = true;
         }
      },
      validatePasswordInput: function() {
         const enteredPassword = ui.registerView.$passwordInput.val();
         ui.registerView.passwordInputIsValid = false;

         if(enteredPassword == "") {
            ui.registerView.$passwordLabel.addClass("invalid");
            ui.registerView.$passwordLabel.text("Password is blank.");
         }

         else if(enteredPassword.length < 10) {
            ui.registerView.$passwordLabel.addClass("invalid");
            ui.registerView.$passwordLabel.text("Password must be at least 10 characters.");
         }

         else {
            ui.registerView.$passwordLabel.removeClass("invalid");
            ui.registerView.$passwordLabel.text(ui.registerView.initialPasswordLabel);
            ui.registerView.passwordInputIsValid = true;
         }

         //Changes to this field cause a re-test of the validity of the confimed password.
         if(enteredPassword != ui.registerView.$confirmPasswordInput.val()) {
            ui.registerView.$confirmPasswordLabel.addClass("invalid");
            ui.registerView.$confirmPasswordLabel.text("Passwords do not match.");
            ui.registerView.confirmPasswordInputIsValid = false;
         }

         else {
            ui.registerView.$confirmPasswordLabel.removeClass("invalid");
            ui.registerView.$confirmPasswordLabel.text(ui.registerView.initialConfirmPasswordLabel);
            ui.registerView.confirmPasswordInputIsValid = true;
         }
      },
      validateConfirmPasswordInput: function() {
         const enteredConfirmPassword = ui.registerView.$confirmPasswordInput.val();
         ui.registerView.confirmPasswordInputIsValid = false;

         if(enteredConfirmPassword == "") {
            ui.registerView.$confirmPasswordLabel.addClass("invalid");
            ui.registerView.$confirmPasswordLabel.text("Confirm your password.");
         }

         else if(enteredConfirmPassword != ui.registerView.$passwordInput.val()) {
            ui.registerView.$confirmPasswordLabel.addClass("invalid");
            ui.registerView.$confirmPasswordLabel.text("Passwords do not match.");
         }

         else {
            ui.registerView.$confirmPasswordLabel.removeClass("invalid");
            ui.registerView.$confirmPasswordLabel.text(ui.registerView.initialConfirmPasswordLabel);
            ui.registerView.confirmPasswordInputIsValid = true;
         }
      },
      validateForm: function() {
         if (
            ui.registerView.usernameInputIsValid
            && ui.registerView.emailInputIsValid
            && ui.registerView.passwordInputIsValid
            && ui.registerView.confirmPasswordInputIsValid
         ) {
            ui.registerView.enableSubmitButton();
         }
         else {
            ui.registerView.disableSubmitButton();
         }
      },

      //API Call
      createUser: async function(username, password, email) {``
         return new Promise((resolve, reject)=> {
            let requestData = {};
            requestData.username = username;
            requestData.password = password;
            if(email) { requestData.email = email; }

            $.ajax({
               method: "POST",
               url: "/api/user/create",
               contentType: "application/json",
               data: JSON.stringify(requestData)
            })
            .then(async ()=> {
               ui.registerView.setFormFeedback("Success!");
               appSession.user = getCookieValue("user");
               appSession.sessionToken = getCookieValue("session");

               await pause(700); //So that the 'Success!" message can be interpreted by the user
               await ui.hideCurrentView("fadeOutLeft");
               ui.userHomeView.show("fadeInRight");
               resolve();
            })
            .catch((returnedData)=> {
               const response = returnedData.responseJSON;
               const errorType = response.errorType;
               console.error("ERROR:", response);

               switch(errorType) {
                  case "UsernameNotUnique":
                     ui.registerView.$usernameLabel.addClass("invalid");
                     ui.registerView.$usernameLabel.text("Username already in use.");
                     break;
                  case "EmailNotUnique":
                     ui.registerView.$emailLabel.addClass("invalid");
                     ui.registerView.$emailLabel.text("Email address already in use.");
                     break;
                  default:
                     alert("ERROR: createUser() enountered an unexpected error.");
                     break;
               }
               ui.registerView.setFormFeedback(ui.registerView.initialFormFeedback);
               ui.registerView.disableSubmitButton();
            });
         });
      }
   },

   signInView: {
      //#region jQuery Seletors
      $view: $("#js-view-signIn"),
      $headerButtons: {
         $registerInstead: $("#js-headerButton-registerInstead")
      },

      //Form Elements
      $formFeedback: $("#js-signIn-formFeedback"),
      $usernameInput: $("#js-signIn-input-username"),
      $usernameLabel: $("#js-signIn-label-username"),
      $passwordInput: $("#js-signIn-input-password"),
      $passwordLabel: $("#js-signIn-label-password"),
      $submitButton: $("#js-signIn-button-submit"),
      //#endregion

      //#region Initial Values
      initialFormFeedback: $("#js-signIn-formFeedback").text(),
      initialUsernameLabel: $("#js-signIn-label-username").text(),
      initialPasswordLabel: $("#js-signIn-label-password").text(),
      //#endregion

      //#region State Variables
      usernameInputIsValid: false,
      passwordInputIsValid: false,
      //#endregion

      configureEventListeners: function() {
         ui.signInView.$headerButtons.$registerInstead.on("click", async function(e) {
            await ui.hideCurrentView("fadeOutRight");
            ui.registerView.show("fadeInLeft");
         });

         $("#form-signIn").on("submit", function(e) {
            //Prevents unnecessary refreshing behavior.
            //The form's submit button interprets the submit event on behalf of the form element.
            e.preventDefault();
         });

         ui.signInView.$usernameInput.on("input", function(e) {
            ui.signInView.validateUsernameInput();
            ui.signInView.validateForm();
         });

         ui.signInView.$passwordInput.on("input", function(e) {
            ui.signInView.validatePasswordInput();
            ui.signInView.validateForm();
         });

         ui.signInView.$submitButton.on("click", async function(e) {
            ui.signInView.setFormFeedback("Signing in...");
            await ui.signInView.signIn(
               ui.signInView.$usernameInput.val(),
               ui.signInView.$passwordInput.val()
            );
         });
      },
      beforeShow: function() {
         return new Promise((resolve, reject)=> {
            ui.signInView.reset();
            resolve();
         });
      },
      show: async function(showAnimation="fadeIn") {
         ui.validateShowAnimation(showAnimation);
         await ui.signInView.beforeShow();
         ui.showView(ui.signInView, showAnimation);
      },
      reset: function() {
         ui.signInView.resetForm();
      },

      setFormFeedback: function(feedback, isError=false) {
         ui.signInView.$formFeedback.text(feedback);
         (isError) ?
            ui.signInView.$formFeedback.css("color", "#FF8A80")
            : ui.signInView.$formFeedback.css("color", "");
      },
      enableSubmitButton: function() {
         ui.signInView.$submitButton.prop("disabled", false);
      },
      disableSubmitButton: function() {
         ui.signInView.$submitButton.prop("disabled", true);
      },
      resetUsernameField: function() {
         ui.signInView.$usernameInput.val("");
         ui.signInView.$usernameLabel.text(ui.signInView.initialUsernameLabel);
         ui.signInView.$usernameLabel.removeClass("invalid");
         ui.signInView.usernameInputIsValid = false;
         ui.signInView.disableSubmitButton();
      },
      resetPasswordField: function() {
         ui.signInView.$passwordInput.val("");
         ui.signInView.$passwordLabel.text(ui.signInView.initialPasswordLabel);
         ui.signInView.$passwordLabel.removeClass("invalid");
         ui.signInView.passwordInputIsValid = false;
         ui.signInView.disableSubmitButton();
      },
      resetForm: function() {
         ui.signInView.setFormFeedback(ui.signInView.initialFormFeedback);
         ui.signInView.resetUsernameField();
         ui.signInView.resetPasswordField();
         ui.signInView.disableSubmitButton();
      },

      validateUsernameInput: function() {
         const enteredUsername = ui.signInView.$usernameInput.val();
         ui.signInView.usernameInputIsValid = false;

         if(enteredUsername == "") {
            ui.signInView.$usernameLabel.addClass("invalid");
            ui.signInView.$usernameLabel.text("Username is blank.");
         }

         else if(enteredUsername.trim().length != enteredUsername.length) {
            ui.signInView.$usernameLabel.addClass("invalid");
            ui.signInView.$usernameLabel.text("Username begins/ends with whitespace.");
         }

         else {
            ui.signInView.$usernameLabel.removeClass("invalid");
            ui.signInView.$usernameLabel.text(ui.signInView.initialUsernameLabel);
            ui.signInView.usernameInputIsValid = true;
         }
      },
      validatePasswordInput: function() {
         const enteredPassword = ui.signInView.$passwordInput.val();
         ui.signInView.passwordInputIsValid = false;

         if(enteredPassword == "") {
            ui.signInView.$passwordLabel.addClass("invalid");
            ui.signInView.$passwordLabel.text("Password is blank.");
         }

         else {
            ui.signInView.$passwordLabel.removeClass("invalid");
            ui.signInView.$passwordLabel.text(ui.signInView.initialPasswordLabel);
            ui.signInView.passwordInputIsValid = true;
         }
      },
      validateForm: function() {
         (ui.signInView.usernameInputIsValid && ui.signInView.passwordInputIsValid) ?
            ui.signInView.enableSubmitButton()
            : ui.signInView.disableSubmitButton();

      },

      //API Call
      signIn: async function(username, password) {
         return new Promise((resolve, reject)=> {
            $.ajax({
               method: "POST",
               url: "/api/auth/sign-in",
               contentType: "application/json",
               data: JSON.stringify({
                  username: username,
                  password: password
               })
            })
            .then(async ()=> {
               ui.signInView.setFormFeedback("Success!");
               appSession.user = getCookieValue("user");
               appSession.sessionToken = getCookieValue("session");

               await pause(700); //So that the 'Success!" message can be parsed by the user

               await ui.hideCurrentView("fadeOutLeft");
               ui.userHomeView.show("fadeInRight");
               resolve();
            })
            .catch((returnedData)=> {
               const response = returnedData.responseJSON;
               const errorType = response.errorType;
               console.error("ERROR:", response);

               switch(errorType) {
                  case "SessionAlreadyActive":
                     alert("ERROR: SessionAlreadyActive");
                     break;
                  case "MissingField":
                     alert("ERROR: MissingField");
                     break;
                  case "UnexpectedDataType":
                     alert("ERROR: UnexpectedDataType");
                     break;
                  case "MissingField":
                     alert("ERROR: MissingField");
                     break;
                  case "UntrimmedString":
                     alert("ERROR: UntrimmedString");
                     break;
                  case "NoSuchUser":
                     ui.signInView.setFormFeedback("No such account.", true);
                     ui.signInView.resetPasswordField();
                     break;
                  default:
                     alert("ERROR: signIn() enountered an unexpected error.");
                     break;
               }
            });
         });
      },
   },

   userHomeView: {
      //#region jQuery Selectors
      $view: $("#js-view-userHome"),
      $headerButtons: {
         $signOut: $("#js-headerButton-signOut"),
         $addRecipe: $("#js-headerButton-addRecipe")
      },

      $activeUser: $("#js-userHome-text-currentUser"),
      $recipeCount: $("#js-userHome-text-recipeCount"),
      $recipeCardsWrapper: $("#js-userHome-wrapper-recipeCards"),
      //#endregion

      //#region State Variables
      scrollPosition: null,
      //#endregion

      //#region Initial Values
      initialActiveUserText: $("#js-userHome-text-currentUser").text(),
      initialRecipeCountText: $("#js-userHome-text-recipeCount").text(),
      //#endregion

      configureEventListeners: function() {
         ui.userHomeView.$headerButtons.$signOut.on("click", function(e) {
            ui.userHomeView.signOut();
         });

         ui.userHomeView.$headerButtons.$addRecipe.on("click", async function(e) {
            ui.userHomeView.cacheScrollPosition();
            await ui.hideCurrentView("fadeOutLeft");

            //TODO: Edit Recipe View Transition
            ui.editRecipeView.show("fadeInRight");
         });

         ui.userHomeView.$recipeCardsWrapper.on("click", ".recipe-card", async function(e) {
            //Isolates 'n' from the element id 'recipe-card-n'
            const selectedCardId = e.currentTarget.id.replace("recipe-card-", "");

            appSession.activeCocktail = appSession.userCocktails[selectedCardId];
            ui.userHomeView.cacheScrollPosition();

            await ui.hideCurrentView("fadeOutLeft");
            ui.recipeView.show("fadeInRight");
         });
      },
      beforeShow: function() {
         return new Promise(async (resolve, reject)=> {
            //Collect information about the current session user
            let userInformation = await ui.userHomeView.getUserInformation(appSession.user);

            //Set the active username display
            ui.userHomeView.$activeUser.text(appSession.user);

            //Set recipe count display
            if (userInformation.createdCocktails.length === 1) {
               ui.userHomeView.$recipeCount.text("1 Recipe");
            }
            else {
               ui.userHomeView.$recipeCount.text(`${userInformation.createdCocktails.length} Recipes`)
            }

            //Render the users cocktail recipes as cards
            ui.userHomeView.renderRecipeCards( userInformation.createdCocktails );

            resolve();
         });
      },
      show: async function(showAnimation="fadeIn") {
         ui.validateShowAnimation(showAnimation);
         await ui.userHomeView.beforeShow();
         ui.showView(ui.userHomeView, showAnimation);
         window.scrollTo(0, ui.userHomeView.priorScrollPosition||0);
      },
      reset: function() {
         ui.userHomeView.scrollPosition = null;
         ui.userHomeView.$activeUser.text(ui.userHomeView.initialActiveUserText);
         ui.userHomeView.$recipeCount.text(ui.userHomeView.initialRecipeCountText);
      },

      buildRecipeCard: function(cardIndex, recipeName, ingredientNames) {
         return `
            <div id="recipe-card-${cardIndex}" class="recipe-card">
               <h3 id="recipe-card-name" class="recipe-name typo-heading-small typo-color-orange">${recipeName}</h3>
               <p id="recipe-card-ingredientNames" class="ingredients-list typo-body-small">${ingredientNames}</p>
               <img src="resources/icons/chevron_right.svg" class="svg-icon svg-show-recipe-chevron" alt="View cocktail recipe...">
            </div>`;
      },
      renderRecipeCards: function(recipesToRender) {
         let constructedRecipeCards = [];

         recipesToRender.forEach((currentRecipe, index)=> {
            //Compose a comma-separated list of recipe ingredient names
            const ingredientNames = currentRecipe.ingredients.map((ingredient)=> {return ingredient.name}).join(", ");
            //Build Recipe Card
            const recipeCard = ui.userHomeView.buildRecipeCard(index, currentRecipe.name, ingredientNames);
            //Push constructed recipe card to storage array
            constructedRecipeCards.push( recipeCard );
         });

         //.join("") combines the array of independed HTML elements into a large HTML chunk that can be inserted at once.
         ui.userHomeView.$recipeCardsWrapper.html( constructedRecipeCards.join("") );
      },
      cacheScrollPosition: function() {
         ui.userHomeView.scrollPosition = window.scrollY;
      },

      //API Calls
      getUserInformation: function(targetUsername) {
         return new Promise((resolve, reject)=> {
            $.ajax({
               method: "GET",
               url: `/api/user/${targetUsername}`
            })
            .then((userInformation)=> {
               appSession.userCocktails = userInformation.createdCocktails;
               resolve(userInformation);
            })
            .catch(async (error)=> {
               const response = error.responseJSON;
               const errorType = response.errorType;
               console.error("ERROR:", response);

               switch(errorType) {
                  case "NoSuchUser":
                     alert("ERROR: NoSuchUser");
                     //The user is both signed in, and nonexistent. This can only happen if the user tampers with their cookies, so the session is deemed invalid and the user is forcibly 'signed out', clearing all active cookies.
                     ui.userHomeView.signOut();
                     break;
                  default:
                     alert("ERROR: Get User Information enountered an unexpected error.");
                     break;
               }
            });
         });
      },
      signOut: function() {
         return new Promise((resolve, reject)=> {
            $.ajax({
               method: "GET",
               url: "/api/auth/sign-out"
            })
            .then(async ()=> {
               appSession.reset();
               ui.reset();

               await ui.hideCurrentView("fadeOutRight")
               ui.landingView.show("fadeInLeft");

               resolve();
            });
         });
      },
   },










   editRecipeView: {
      configureEventListeners: function() {
         console.log(`> ui.editRecipeView.configureEventListeners()`);
      },
      beforeShow: function() {
         return new Promise((resolve, reject)=> {
            console.log(`> ui.editRecipeView.beforeShow()`);
            //Do things here...
            resolve();
         });
      },
      show: async function(showAnimation="fadeIn") {
         console.log(`> ui.editRecipeView.show(${showAnimation})`);
         ui.validateShowAnimation(showAnimation);
         await ui.editRecipeView.beforeShow();
         ui.showView(ui.editRecipeView, showAnimation);
      },
      reset: function() {
         console.log(`> ui.editRecipeView.reset()`);
      },
   },










   recipeView: {
      configureEventListeners: function() {
         console.log(`> ui.recipeView.configureEventListeners()`);
      },
      beforeShow: function() {
         return new Promise((resolve, reject)=> {
            console.log(`> ui.recipeView.beforeShow()`);
            //Do things here...
            resolve();
         });
      },
      show: async function(showAnimation="fadeIn") {
         console.log(`> ui.recipeView.show(${showAnimation})`);
         ui.validateShowAnimation(showAnimation);
         await ui.recipeView.beforeShow();
         ui.showView(ui.recipeView, showAnimation);
      },
      reset: function() {
         console.log(`> ui.recipeView.reset()`);
      },
   },
   //#endregion



   //#region UI Setup Functions
   setup: function() {
      ui.configureEventListeners();
   },

   configureEventListeners: function() {
      //If the user is navigating with the mouse, hide unecessary accessibility styles
      $(window).on("mousedown", function(e) {
         if($("html").hasClass("user-navigating-with-keyboard")) {
            console.log("Mouse navigation detected.");
            $("html").removeClass("user-navigating-with-keyboard");
         }
      });

      //If the user is navigating with the keyboard (specifically the tab key) and acessibility styles have been hidden, show necessary accessibility styles
      $(window).on("keydown", function handleTab(e) {
         if(e.key==="Tab" && !$("html").hasClass("user-navigating-with-keyboard")) {
            console.log("Keyboard navigation detected.");
            $("html").addClass("user-navigating-with-keyboard");
         }
      });

      ui.landingView.configureEventListeners();
      ui.signInView.configureEventListeners();
      ui.registerView.configureEventListeners();
      ui.userHomeView.configureEventListeners();
      ui.editRecipeView.configureEventListeners();
      ui.recipeView.configureEventListeners();
   },
   //#endregion



   //#region General UI Functions
   scrollToBottom: function(ms) {
      $("html").stop(true)
      .animate({
         scrollTop: $("html").height()
      }, ms);
   },
   reset: function() {
      ui.signInView.reset();
      ui.registerView.reset();
      ui.userHomeView.reset();
      ui.editRecipeView.reset();
      ui.recipeView.reset();
   },
   //#endregion



   //#region Animation Functions
   validateHideAnimation: function(hideAnimation) {
      const validHideAnimations = ["fadeOutLeft", "fadeOut", "fadeOutRight"];
      if(!validHideAnimations.includes(hideAnimation)) {
         throw Error(`Invalid showAnimation: '${hideAnimation}'`);
      }
   },
   validateShowAnimation: function(showAnimation) {
      const validShowAnimations = ["fadeInLeft", "fadeIn", "fadeInRight"];
      if(!validShowAnimations.includes(showAnimation)) {
         throw Error(`Invalid showAnimation: '${showAnimation}'`);
      }
   },

   hideCurrentView: function(hideAnimation="fadeOut") {
      const headerButtonHideDelay = 100; //ms
      const headerButtonFadeOutDuration = 300; //ms

      return new Promise(async (resolve)=> {
         ui.validateHideAnimation(hideAnimation);

         //Hide all header buttons.
         //The wildcard selector is used in case additional, non-button elements are added to the header in the future.
         $("#wrapper-header-rightArea button")
         .css({
            "pointer-events": "none",
            "transition": "none"
         })
         .delay(headerButtonHideDelay)
         .fadeOut(headerButtonFadeOutDuration)
         .css({
            "pointer-events": "",
            "transition": ""
         });

         //If there's an active view, hide it
         if (ui.currentView) {
            await ui.hideWithAnimation(ui.currentView.$view, hideAnimation);
            ui.currentView = null;
         }
         else {
            console.error(`ui.hideCurrentView() called while ui.currentView is null with animation '${showAnimation}'.`);
            console.trace();
         }
         resolve();
      });
   },
   showView: function(targetView, showAnimation) {
      const headerButtonFadeInDuration = 300; //ms

      ui.validateShowAnimation(showAnimation);

      //Prevent the new view's header buttons from being interactive before they have finished fading in
      for (let $currentButton of Object.values(targetView.$headerButtons)) {
         $currentButton.css({
            "pointer-events": "none",
            "transition": "none"
         });
      }

      //Show the new view
      ui.showWithAnimation(targetView.$view, showAnimation);

      //Set the currentView UI variable to the new view
      if (ui.currentView == null) {
         ui.currentView = targetView;
      }
      else {
         console.error(`ui.showView() called on already-shown view '${$targetView.$view}' with animation '${showAnimation}'.`);
         console.trace();
      }

      //Show the new view's header buttons
      for (let $currentButton of Object.values(targetView.$headerButtons)) {
         $currentButton.fadeIn(headerButtonFadeInDuration, function() {
            //Allow the new view's header buttons to be interactive now that they have finished fading in
            $currentButton.css({
               "pointer-events": "",
               "transition": ""
            });
         });
      }
   },

   hideWithAnimation: function($targetElement, hideAnimation="fadeOut") {
      return new Promise((resolve, reject)=> {
         //If the targeted element is not already hidden...
         if ($targetElement.css("display") != "none") {
            //Some of these events may be obsolete, but I am unsure where to find a up-to-date list of relevent vendor-specific 'animationend' events. As such, I have included all that I could find, obsolescence aside.
            const animationEndEvents = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

            //Register the 'animationend' event handler
            $targetElement.one(animationEndEvents, function() {
               //Add display:none to the element once it has finished animating
               $(this).hide();
               //Remove the animate.css classes from the element now that they have completed
               $(this).removeClass(`animated faster ${hideAnimation}`);
               resolve();
            });

            //Trigger the animation, and subsequently the 'animationend' event handler, by applying the animate.css classes
            $targetElement.addClass(`animated faster ${hideAnimation}`);
         }
         else {
            //Not entirely an error, but it should not occur under normal circumstances, so it is logged as an error.
            console.error(`hideWithAnimation() called on already-hidden element '${$targetElement}' with animation '${hideAnimation}'.`);
            console.trace();
            resolve();
         }

      });
   },
   showWithAnimation: function($targetElement, showAnimation="fadeIn") {
      return new Promise((resolve, reject)=> {
         //If the targeted element is hidden...
         if ($targetElement.css("display") == "none") {
            //Some of these events may be obsolete, but I am unsure where to find a up-to-date list of relevent vendor-specific 'animationend' events. As such, I have included all that I could find, obsolescence aside.
            const animationEndEvents = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

            //Register the animationEnd event handler
            $targetElement.one(animationEndEvents, function() {
               //Remove the animate.css classes from the element now that they have completed
               $(this).removeClass(`animated faster ${showAnimation}`);
               resolve();
            });

            //Trigger the animation, and subsequently the 'animationend' event handler, by applying the animate.css classes
            $targetElement.addClass(`animated faster ${showAnimation}`);
            //Remove display:none from the element as it begins animating
            $targetElement.show();
         }
         else {
            //Not entirely an error, but it should not occur under normal circumstances, so it is logged as an error.
            console.error(`showWithAnimation() called on already-shown element '${$targetElement}' with animation '${showAnimation}'.`);
            console.trace();
            resolve();
         }

      });
   },
   //#endregion
}