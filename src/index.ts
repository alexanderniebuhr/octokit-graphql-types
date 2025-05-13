import jwt from 'jsonwebtoken';

export default {
  fetch() {
    const decoded = jwt.verify(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
       "your-256-bit-secret", {
			algorithms: ['HS256'],
			complete: false,
		});
    console.log(decoded)
    return new Response(`Running in ${navigator.userAgent}!`);
  },
};