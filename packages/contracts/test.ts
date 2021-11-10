const validNumbers = [0, 1, 2, 3, 5, 7, 9];
const submissions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let deleted = 0;
for (let i = 0; i < submissions.length; i++) {
  if (validNumbers.indexOf(submissions[i]) === -1) {
    deleted++;
    continue;
  }
  if (deleted > 0) {
    submissions[i - deleted] = submissions[i];
  }
}
for (let i = 0; i < deleted; i++) {
  submissions.pop();
}

console.log(submissions);
