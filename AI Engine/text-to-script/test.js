const { createVideo } = require("./ai-engine/index");

async function test() {
  console.log("Testing AI Video Generator Engine...");

  try {
    const result = await createVideo("Create a story about a brave lion");
    console.log("\n✓ Video generation pipeline executed successfully");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("✗ Error:", error.message);
  }
}

test();
