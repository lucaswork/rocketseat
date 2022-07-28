import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Comment } from "./Comment";
import { Avatar } from "./Avatar";
import styles from "./Post.module.css";

export function Post({ author, content, publishedAt }) {
  const [comments, setComments] = useState([1]);
  const [newCommentText, setNewCommentText] = useState("");
  const publishedDateFormat = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });
  const publishedDateRelativeFromNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  function handleCreateComment(event) {
    event.preventDefault();
    setComments([...comments, comments.length + newCommentText]);
    setNewCommentText("");
  }

  function handleNewCommentChanged(e) {
    setNewCommentText(e.target.value);
  }

  function onDeleteComment(comment) {
    setComments(comments.filter((c) => c !== comment));
  }

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>
        <time title={publishedDateFormat} dateTime={publishedAt.toISOString()}>
          {publishedDateRelativeFromNow}
        </time>
      </header>
      <div className={styles.content}>
        {content.map((line, index) => {
          return line.type === "paragraph" ? (
            <p key={index}>{line.content}</p>
          ) : (
            <p key={index}>
              <a href="#">{line.content}</a>
            </p>
          );
        })}
      </div>

      <form className={styles.commentForm} onSubmit={handleCreateComment}>
        <strong>Deixe seu feedback</strong>
        <textarea
          name="comment"
          placeholder="Deixe um comentário"
          value={newCommentText}
          onChange={handleNewCommentChanged}
        />
        <footer>
          <button type="submit">Comentar</button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment, index) => (
          <Comment
            content={comment}
            key={index}
            onDeleteComment={onDeleteComment}
          />
        ))}
      </div>
    </article>
  );
}
