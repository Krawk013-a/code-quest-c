// teste manual do tradutor (não faz parte do build)
import { translateError } from "../src/lib/runner/error-translator";

const cases: [string, string][] = [
  [
    "missing ;",
    "main.c: In function ‘main’:\nmain.c:2:23: error: expected ‘;’ before ‘return’",
  ],
  [
    "undeclared var",
    "main.c:5:5: error: ‘idade’ undeclared (first use in this function)",
  ],
  [
    "segfault",
    "run.sh: line 1:     3 Segmentation fault      (core dumped) ./a.out",
  ],
  [
    "printf sem include",
    "main.c:2:5: warning: incompatible implicit declaration of built-in function ‘printf’",
  ],
];

for (const [name, err] of cases) {
  console.log(`\n[${name}]`);
  console.log("→", translateError(err) ?? "(sem tradução)");
}
