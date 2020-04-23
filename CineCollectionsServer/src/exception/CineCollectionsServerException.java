package exception;

public class CineCollectionsServerException extends Exception {
    public CineCollectionsServerException(String message) { super(message); }
    public CineCollectionsServerException(String message, Throwable cause) { super(message, cause); }
}
