"""Generate suggested Amazon-style questions for a product listing.

Usage:
    python AmazonQ_generate_suggestion.py --product "Wireless earbuds" --features "noise cancellation,battery life,bluetooth 5.3"
"""

from __future__ import annotations
import argparse
from typing import List


def generate_amazon_questions(product_name: str, features: List[str]) -> List[str]:
    product_name = product_name.strip()
    if not product_name:
        raise ValueError("Product name must not be empty.")

    if not features:
        return [
            f"What are the main benefits of {product_name}?",
            f"How long does the {product_name} last on a single charge?",
            f"Is the {product_name} easy to use for beginners?",
            f"Does the {product_name} include a warranty?",
            f"What makes the {product_name} different from other products in its category?",
        ]

    questions: List[str] = []
    for feature in features:
        feature = feature.strip()
        if not feature:
            continue

        lower_feature = feature.lower()
        if "battery" in lower_feature or "charge" in lower_feature:
            questions.append(f"How long does the {product_name} last on a single charge?")
        elif "noise" in lower_feature or "cancellation" in lower_feature:
            questions.append(f"Does the {product_name} provide effective {feature}?")
        elif "size" in lower_feature or "fit" in lower_feature:
            questions.append(f"What size options are available for the {product_name}?")
        elif "compat" in lower_feature or "bluetooth" in lower_feature:
            questions.append(f"Is the {product_name} compatible with all smartphones and devices?")
        elif "warranty" in lower_feature or "support" in lower_feature:
            questions.append(f"What warranty or support does the {product_name} include?")
        else:
            questions.append(f"How does the {product_name} perform when using {feature}?")

    unique_questions: List[str] = []
    for q in questions:
        if q not in unique_questions:
            unique_questions.append(q)

    return unique_questions[:7] if unique_questions else [
        f"What are the main benefits of {product_name}?",
        f"How does the {product_name} compare to similar products?",
        f"Is the {product_name} easy to set up and use?",
        f"How durable is the {product_name}?",
        f"Can the {product_name} be used every day?",
    ]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate Amazon-style product questions from a product name and list of features."
    )
    parser.add_argument(
        "--product",
        required=True,
        help="Product name or title to generate questions for."
    )
    parser.add_argument(
        "--features",
        default="",
        help="Comma-separated product features or selling points."
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    features = [f.strip() for f in args.features.split(",") if f.strip()]
    questions = generate_amazon_questions(args.product, features)

    print("Suggested Amazon questions:")
    for idx, question in enumerate(questions, start=1):
        print(f"{idx}. {question}")


if __name__ == "__main__":
    main()
