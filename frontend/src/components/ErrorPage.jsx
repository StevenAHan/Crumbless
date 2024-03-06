import { useState, useEffect } from "react";

function ErrorPage() {
 
    return (
        <>
            <h1>The url either does not exist, or you are not allowed to access it.</h1>

            <p>If you think this is a mistake, please contact us and explain the issue.</p>
        </>
    );
}
 
export default ErrorPage;