using System;

public class ScoreManager {
  public void CalculateScores(int[] scores)
  {
      int maxScore = 0;
      int minScore = 100;
      int totalScore = 0;
      int numOfScores = scores.Length;

      for (int i = 0; i < numOfScores; i++)
      {
          totalScore += scores[i];

          if (scores[i] > maxScore)
          {
              maxScore = scores[i];
          }

          if (scores[i] < minScore)
          {
              minScore = scores[i];
          }
      }

      int averageScore = totalScore / numOfScores;

      Debug.Log("Max score: " + maxScore);
      Debug.Log("Min score: " + minScore);
      Debug.Log("Total score: " + totalScore);
      Debug.Log("Average score: " + averageScore);
  }
}
