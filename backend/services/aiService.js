const generateScript = async (prompt) => {
  return `
  Story Title: AI Adventure

  ${prompt}

  Scene 1:
  Hero enters city.
  `;
};

module.exports = {
  generateScript
};
