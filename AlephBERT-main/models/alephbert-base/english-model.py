import torch, sys
from transformers import BertTokenizerFast, BertForMaskedLM

# OPTIONAL: if you want to have more information on what's happening, activate the logger as follows
import logging
logging.basicConfig(level=logging.INFO)

# Load pre-trained model tokenizer (vocabulary)
tokenizer = BertTokenizerFast.from_pretrained('bert-base-uncased')
sentence = "i love you"
mask = "love"
# sentence = sys.argv[1]
# mask = sys.argv[2]
sentence = sentence.replace(mask, '[MASK]')
# print(sentence)
text = '[CLS] ' + sentence + ' . [SEP]'
tokenized_text = tokenizer.tokenize(text)
indexed_tokens = tokenizer.convert_tokens_to_ids(tokenized_text)

# Create the segments tensors.
segments_ids = [0] * len(tokenized_text)

# Convert inputs to PyTorch tensors
tokens_tensor = torch.tensor([indexed_tokens])
segments_tensors = torch.tensor([segments_ids])

# Load pre-trained model (weights)
model = BertForMaskedLM.from_pretrained('bert-base-uncased')
model.eval()

# Predict all tokens
with torch.no_grad():
    predictions = model(tokens_tensor, segments_tensors)

masked_index = tokenized_text.index('[MASK]')
num_of_res = 10

predicted_sorted = torch.argsort(predictions[0][0, masked_index], descending=True)
topres = tokenizer.convert_ids_to_tokens([x.item() for x in predicted_sorted[:num_of_res]])

def probs_from_predictions(predictions):
    min_prediction = -predictions[0][0, masked_index][predicted_sorted[-1]]
    sum_of_predictions = torch.sum(predictions[0][0, masked_index])
    return (predictions[0][0, masked_index] + min_prediction) / (sum_of_predictions + min_prediction * len(predicted_sorted))

probs = probs_from_predictions(predictions)

sum_of_probs = torch.sum(probs)
assert(abs(sum_of_probs - 1) < 0.00001)

top_probs = torch.tensor([probs[tokenizer.convert_tokens_to_ids([res])[0]].item() for res in topres])
sum_of_top = torch.sum(top_probs)

relative_probs = top_probs / sum_of_top
# nice_probs = [('{:.5f}'.format(x.item())) for x in relative_probs]

with_prob = list(zip(topres, relative_probs.tolist()))



print(with_prob)
