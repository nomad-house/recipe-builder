import ejs from "ejs";

function render(origin: string, message: string) {
  if (!origin) {
    return ejs.render("<!doctype html><body>Origin missing</body></html>");
  }

  return ejs.render(
    `<!doctype html><body><script>
(function() {
  window.addEventListener("message", (e) {
    if ('<%= origin %>' !== e.origin) {
      console.log("Wrong origin");
      return;
    }
    
    console.log("Sending message");
    window.opener.postMessage('<%- message %>', '<%= origin %>');
  }, false);
  
  console.log("Initiate handshake");
  window.opener.postMessage("authorizing:github", '<%= origin %>')
})()
</script></body></html>`,
    { origin, message }
  );
}

export function renderError(origin: string, err: Error | string) {
  return render(origin, `authorization:github:error:{"message":"${err}"}`);
}

export function renderSuccess(origin: string, token: string) {
  return render(
    origin,
    ejs.render(`authorization:github:success:{"token":"<%= token %>","provider":"github"}`, {
      token
    })
  );
}
