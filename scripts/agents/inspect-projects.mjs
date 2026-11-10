import { execSync } from 'node:child_process';

function queryGql(query) {
  const res = execSync('gh api graphql --input -', {
    input: JSON.stringify({ query }),
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
  return JSON.parse(res);
}

const q = `query {
  org: organization(login: "idedigitalbr") {
    p4: projectV2(number: 4) {
      id
      title
      fields(first: 20) {
        nodes {
          ... on ProjectV2Field { id name }
          ... on ProjectV2SingleSelectField {
            id
            name
            options { id name }
          }
        }
      }
    }
    p5: projectV2(number: 5) {
      id
      title
      fields(first: 20) {
        nodes {
          ... on ProjectV2Field { id name }
          ... on ProjectV2SingleSelectField {
            id
            name
            options { id name }
          }
        }
      }
    }
  }
}`;

const res = queryGql(q);
console.log('Project 4 Fields:');
console.log(JSON.stringify(res.data.org.p4, null, 2));
console.log('\nProject 5 Fields:');
console.log(JSON.stringify(res.data.org.p5, null, 2));
