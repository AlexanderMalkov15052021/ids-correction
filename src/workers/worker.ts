const ctx: Worker = self as any;

const sendFile = () => {

    ctx.postMessage({ url: "/" });
}

ctx.addEventListener("message", sendFile);