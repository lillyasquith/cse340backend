// <%- messages() %>

<div id="classification-form">
    {/* <h1><%- title %></h1> */}
    <form class="form-container" action="/inventory/add-classification" method="post">
        <p class="required-text">FIELD IS REQUIRED</p>
        <fieldset>
            <label class="form-label" for="classification">Classifiation Name:
                <input type="text" id="classification" name="classification_name" required value="<%= locals.classification_name %>" />
            </label>
        </fieldset>
        <button class="submitBtn" type="submit">Add Classifiation</button>
    </form>
</div>