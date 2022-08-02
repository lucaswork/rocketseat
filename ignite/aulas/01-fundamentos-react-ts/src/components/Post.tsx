import { useState, ChangeEvent, FormEvent, InvalidEvent } from "react";
import { format, formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Comment } from "./Comment";
import { Avatar } from "./Avatar";
import styles from "./Post.module.css";

interface Author {
  name: string
  role: string
  avatarUrl: string
}

interface Content {
  type: 'paragraph' | 'link'
  content: string
}

interface PostPros {
  author: Author
  content: Content[]
  publishedAt: Date
}

export function Post({ author, content, publishedAt }: PostPros) {
  const [comments, setComments] = useState(['Post muito bacana, hein?']);
  const [newCommentText, setNewCommentText] = useState("");
  const publishedDateFormat = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });
  const publishedDateRelativeFromNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  function handleCreateComment(event: FormEvent) {
    event.preventDefault();
    setComments([...comments, comments.length + newCommentText]);
    setNewCommentText("");
  }

  function handleNewCommentChanged(e: ChangeEvent<HTMLTextAreaElement>) {
    e.target.setCustomValidity("");
    setNewCommentText(e.target.value);
  }

  function handleNewCommentInvalid(e: InvalidEvent<HTMLTextAreaElement>) {
    e.target.setCustomValidity("Esse campo é obrigatório!");
  }

  function onDeleteComment(commentToDelete: string) {
    const commentWithoutDeletedOne = comments.filter((comment) => {
      return comment !== commentToDelete
    })
    setComments(commentWithoutDeletedOne);
  }

  const isNewCommentEmpty = newCommentText.length === 0;

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
          required
          name="comment"
          placeholder="Deixe um comentário"
          value={newCommentText}
          onChange={handleNewCommentChanged}
          onInvalid={handleNewCommentInvalid}
        />
        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>
            Comentar
          </button>
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
